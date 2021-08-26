const User = require('../model/userSchema');
const bcrypt = require('bcrypt');
const JwtUtil = require('../utils/jwt.util');

const signUserIn = (username,password,cb) => {

    // query to look for the user by username
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            return cb(err,null,null);
        }
        if (!user) {
            return cb('User does not exist!',null,null);
        }
        // create a user object to pass into generateToken and generaterefreshToken
        let user_object = { username:user.username, name:user.name }
        // compare the password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return cb(err,null,null);
            }
            if (result === true) {
                // create the data object 
                let data = {
                    user: user,
                    accessToken: JwtUtil.generateToken(user_object),
                    refreshToken: JwtUtil.generateRefreshToken(user_object)
                }
                return cb(null,'User successfully logged in',data)    
            } else {
                return cb('Password is wrong!',null,null); 
            }
        });

    })
}

const refreshToken = (refresh, cb) => {
    if(!refresh) return cb('No available', null, 403);

    // check if the refresh token exists 
    if (!JwtUtil.refreshTheToken(refresh)) {
        return cb('invalid refresh token', null, 403);
    }
    else {
        // verify the refresh if it does exist
        jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            // if err, then the token sent is not valid
            if (err) {
                return cb(err,null,403)
            }
            // generate a new token if valid
            else {
                const newAccessToken = JwtUtil.generateToken({ name: user.name })
                return cb(null, { accessToken: newAccessToken, refreshToken: refresh },200);
            }
        })
    }
}

const verify = (token, cb) => {
    // verify the token
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,result) => {
        if (err) {
            return cb(err,null);
        }
        else {
            return cb(null,result);

        }
    })
}
module.exports = {
    signUserIn,
    refreshToken,
    verify
}