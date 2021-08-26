'use strict'
const AuthService = require('../services/auth.service')

const signIn = (req, res) => {
    AuthService.signUserIn(req.body.username, req.body.password, (err, result, data) =>{
        return res.json({
            message: err ? err : result,
            success: err ? false : true,
            data: data
        })
    })
}

const refreshToken = (req, res) => {
    AuthService.refreshToken(req.body.refresh, (err, result, status) => {
        if (status != 200) {
            return res.status(status).json({
                message: err ? err : result
            })
        }
        else {
            return res.status(status).json({
                result
            })
        }
    })   
}

const verify = (req,res) => {
    // get the token from the headers
    let token = req.headers.authorization.split(' ')[1];
    AuthService.verify(token, (err,result) => {
        return res.json({
            message: err ? err : result,
            success: err ? false: true
        })
    })
}

module.exports = {
    signIn,
    verify,
    refreshToken
}