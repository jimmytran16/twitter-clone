const jwt = require('jsonwebtoken')
const tokensModel = require('../../model/tokenSchema')

require('dotenv').config();

// function to generate a jwt token
const generateToken = (user) => {
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, { expiresIn:'3600s' });
}

// func to generate a refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
}

// function to check if the refresh token exists (return true if exist)
const refreshTheToken = (refresh) => {
    // verify if the refresh token is existing inside the refreshToken arr (will be in database in production)

    // verify to see if the token exists inside the database
    tokensModel.find({ token:refresh }, (err,data) => {
        console.log('inside of the function()'  + refresh);
        console.log(data);
        // check if there is an error
        if ( err )  {
            console.log(err);
            return false;
        }
        // check to see if there is any refresh tokens returned back, if there isn't, then the token does not exist
        if (Object.keys(data).length === 0) {
            return false;
        }
    })
    return true;
}

//export the functions
module.exports = {
    generateToken:generateToken,
    generateRefreshToken:generateRefreshToken,
    refreshTheToken:refreshTheToken
}