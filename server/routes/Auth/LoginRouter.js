const router = require('express').Router();
const User = require('../../model/userSchema');
const bcrypt = require('bcrypt');
const jwtMethods = require('./Jwt');
const jwt = require('jsonwebtoken');

router.post('/signin', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    console.log(req.body)
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
                    accessToken: jwtMethods.generateToken(user_object),
                    refreshToken: jwtMethods.generateRefreshToken(user_object)
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
})

router.post('/verify', (req,res) => {
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
})


module.exports = router;
