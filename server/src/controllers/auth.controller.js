
const bcrypt = require('bcrypt');
const JwtUtil = require('../utils/jwt.util');
const User = require('../model/userSchema');

const signIn = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // query to look for the user by username
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            return res.json({
                success: false,
                message: err
            })
        }
        if (!user) {
            return res.json({
                success: false,
                message: 'User does not exist!'
            })
        }
        // create a user object to pass into generateToken and generaterefreshToken
        let user_object = { username:user.username, name:user.name }
        // compare the password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.json({
                    message: err,
                    success: false
                })
            }
            if (result === true) {
                // create the data object 
                let data = {
                    user: user,
                    accessToken: JwtUtil.generateToken(user_object),
                    refreshToken: JwtUtil.generateRefreshToken(user_object)
                }
                return res.json({
                    message: 'User successfully logged in',
                    success: true,
                    data: data
              })
            } else {
                return res.json({
                    message: 'Password is wrong!',
                    success: false
                })
            }
        });

    })
}

const verify = (req,res) => {
    // get the token from the headers
    let token = req.headers.authorization.split(' ')[1];
    // verify the token
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,result) => {
        if (err) {
            return res.json({
                message:err,
                success:false
            })
        }
        else {
            return res.json({
                message:result,
                success:true
            })
        }
    })
}

const refreshToken = (req, res) => {
    const refresh = req.body.refresh
    if (!refresh) res.status(403).json({ message: 'No available' });

    // check if the refresh token exists 
    if (!auth.refreshTheToken(refresh)) {
        res.status(403).json({ message: 'invalid refresh token' });
    }
    else {
        // verify the refresh if it does exist
        jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            // if err, then the token sent is not valid
            if (err) {
                res.sendStatus(403);
                res.end();
            }
            // generate a new token if valid
            else {
                const newAccessToken = auth.generateToken({ name: user.name })
                res.status(200).json({
                    accessToken: newAccessToken,
                    refreshToken: refresh
                })

            }
        })
    }
}

module.exports = {
    signIn,
    verify,
    refreshToken
}