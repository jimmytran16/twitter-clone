const { UserService } = require('../services/index')

const getPosts = (req, res, next) => {
    UserService.getAllPosts((err, result) => {
        return res.json({
            data: err ? err : result,
            success: err ? false : true
        })
    })
}

const getProfile = (req, res, next) => {
    //  get user's post based on ID
    UserService.getUsersPost(req.query.userid, (err, result) => {
        return res.json({
            data: err ? err : result,
            success: err ? false : true
        })
    })
}

const getLikedTweets = (req, res) => {
    UserService.getPostIdsOfUsersLikes(req.params.userId, (err, result) => {
        return res.json({
            message: err ? err : result,
            success: err ? false : true
        })
    })
}

const postTweet = (req, res) => {
    UserService.postTheTweet(req.body, (err, result) => {
        return res.json({
            data: err ? err : result,
            success: err ? false : true
        })
    })
}

const updatePostInteraction = (req, res) => {
    UserService.updatePostInteraction(req.body, (err, result) => {
        return res.json({
            data: err ? err : result,
            success: err ? false : true
        })
    })
}

const getSpecificPostForThread = (req, res) => {
    UserService.getUserThreadAndComments(req.params.id, (err, result) => {
        return res.json({
            message: err ? err : result,
            success: err ? false : true
        })
    })
}

const deleteTweet = (req, res) => {
    UserService.deleteTweet(req.body.id, (err, message) => {
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
}

const editSettings = (req,res,next) => {
    // get the user id,
    UserService.editSettings(req.body, (err, result) => {
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
}

const uploadProfile = (req, res, next) => {
    UserService.uploadUserProfilePicture(req.body,req.file , (err , data) => {
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
}

module.exports = {
    getPosts,
    getProfile,
    getLikedTweets,
    postTweet,
    updatePostInteraction,
    getSpecificPostForThread,
    deleteTweet,
    editSettings,
    uploadProfile
}