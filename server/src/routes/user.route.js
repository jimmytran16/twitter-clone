'use strict';

if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const multer = require('multer')
const userController = require('../controllers/user.controller')

// Initiating a memory storage engine to store files as Buffer objects
const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
    },
});

// route for the user's dashboard (retrieve the tweets)
router.get('/', authenticateUser, userController.getPosts);
// endpoint to get the specific user's post p
router.get('/profile', authenticateUser, userController.getProfile)

router.get('/get-all-liked-tweets/:userId', authenticateUser, userController.getLikedTweets)
// endpoint for the user to tweet
router.post('/tweet/post', authenticateUser, userController.postTweet);
// endpoint for user to like a post
router.post('/interaction', authenticateUser, userController.updatePostInteraction);
//endpoint for getting specific tweet for thread
router.get('/thread/:id', userController.getSpecificPostForThread);
// endpoint to delete the tweet of user
router.delete('/delete-tweet', authenticateUser, userController.deleteTweet);
// route to edit name, phone #, password
router.post('/edit-settings', authenticateUser, userController.editSettings);
// router to upload/update the user's profile picture
router.post('/upload', uploader.single('file'), userController.uploadProfile);

// middleware function to authorizate the user to use certain endpoints
function authenticateUser(req, res, next) {
    // validate to ensure that there is an authorization token passed into the header
    if (!req.headers || !req.headers.authorization) {
        return res.json({
            message: 'Unauthorized!',
            err: 'Please include an Authorization header',
            success: false
        })
    }
    // verify the jwt token
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.ACCESS_TOKEN_SECRET, (err, result) => {
        if (err) {
            return res.json({
                message: err,
                msg: 'Unauthorized!',
                success: false
            })
        }
        next();
    })
}
module.exports = router;