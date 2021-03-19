const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const multer = require('multer')
const { postTheTweet, updatePostInteraction, getUsersPost, getAllPosts, 
    getUserThreadAndComments, getPostIdsOfUsersLikes, deleteTweet, 
    uploadUserProfilePicture, editSettings } = require('./Actions')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

// route for the user's dashboard (retrieve the tweets)
router.get('/', authenticateUser, (req, res) => {
    getAllPosts((err, result) => {
        if (err) {
            res.json({
                data: result,
                success: false
            })
        } else {
            res.json({
                data: result,
                success: true
            })
        }
    })
})

// endpoint to get the specific user's post p
router.get('/profile', authenticateUser, (req, res) => {
    //  get user's post based on ID
    getUsersPost(req.query.userid, (err, data) => {
        if (err) {
            res.json({
                data: err,
                success: false
            })
        } else {
            res.json({
                data: data,
                success: true
            })
        }
    })

})

router.get('/get-all-liked-tweets/:userId', authenticateUser, (req, res) => {
    getPostIdsOfUsersLikes(req.params.userId, (err, data) => {
        if (err) {
            res.json({
                message: err,
                success: false
            })
        }
        else {
            res.json({
                message: data,
                success: true
            })
        }
    })
})

// endpoint for the user to tweet
router.post('/tweet/post', authenticateUser, (req, res) => {
    postTheTweet(req.body, (err, data) => {
        if (err) {
            res.json({
                message: err,
                success: false
            })
        }
        else {
            res.json({
                message: 'Sucessfully saved tweet!',
                success: true
            })
        }
    })
})

// endpoint for user to like a post
router.post('/interaction', authenticateUser, (req, res) => {
    updatePostInteraction(req.body, (err, result) => {
        if (err) {
            res.json({
                message: err,
                success: false
            })
        } else {
            res.json({
                message: result,
                success: true
            })
        }
    })
})

//endpoint for getting specific tweet for thread
// pass back post data and comments of that tweet
router.get('/thread/:id', (req, res) => {
    getUserThreadAndComments(req.params.id, (err, data) => {
        if (err) {
            res.json({
                message: err,
                success: false
            })
        } else {
            res.json({
                message: data,
                success: true
            })
        }
    })
})

// endpoint to delete the tweet of user
router.delete('/delete-tweet', authenticateUser, (req, res) => {
    deleteTweet(req.body.id, (err, message) => {
        if (err) {
            res.json({
                message: message,
                success: false
            })
        } else {
            res.json({
                message: message,
                success: true
            })
        }
    })
})

// Initiating a memory storage engine to store files as Buffer objects
const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
    },
});
// router to upload/update the user's profile picture
router.post('/upload', uploader.single('file'), (req, res, next) => {
    uploadUserProfilePicture(req.body,req.file , (err , data) => {
        if (err) {
            return res.json({
                message:err,
                success:false
            })
        }else {
            return res.json({
                message:data,
                success:true
            })
        }
    })
})

// route to edit name, phone #, password
router.post('/edit-settings', (req,res,next) => {
    // get the user id,
    editSettings(req.body, (err, result) => {
        if (err) {
            res.json({
                message:err,
                success:false
            })
        }else {
            res.json({
                message:result,
                success:true
            })
        }
    })
})

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