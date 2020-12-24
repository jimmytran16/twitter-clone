const Post = require('../../model/postSchema')
const Comment = require('../../model/commentSchema')
const Likes = require('../../model/likesSchema')
const { post } = require('./UserActionRouter')
const mongoose = require('mongoose')

// function to post the tweet, and will return a callback
const postTheTweet = (TWEET_INFO, cb) => {
    post = new Post(TWEET_INFO)
    // set the date for the post before saving it
    post['date'] = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    post.save((err, data) => {
        if (err) {
            cb(err, null)
            return
        }
        else {
            cb(null, data)
        }
    })
}

// function will try to update the post's interaction and send back a callback
const updatePostInteraction = (REQUEST_BODY, cb) => {
    // check if the the body's data contains all data
    if (!REQUEST_BODY || !REQUEST_BODY.action || !REQUEST_BODY.id) {
       return cb('id and action required in request body!', null);
    }

    var COMMENT_BODY;
    let INTERACTION_TYPE;
    let POST_ID = REQUEST_BODY.id;
    // switch case to determine which action the user took
    switch (REQUEST_BODY.action) {
        case 'RETWEETS':
            INTERACTION_TYPE = { $inc: { retweets: 1 } }
            break;
        case 'LIKES':
            INTERACTION_TYPE = { $inc: { likes: 1 } }
            break;
        case 'COMMENT':
            INTERACTION_TYPE = { $inc: { comments: 1 } }
            // we want to check if the post has comments yet, if not create a nnew object for the comment schema
            COMMENT_BODY = {
                reply: REQUEST_BODY.reply,
                userId: REQUEST_BODY.userId,
                username: REQUEST_BODY.username,
                date: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
            }
            break;
        case 'LINKOFF':
            INTERACTION_TYPE = { $inc: { likes: 1 } }
            break;
        default:
            cb('ACTION INVALID', null);
            return;
    }
    // check if the action is LIKES
    if (REQUEST_BODY.action === 'LIKES') {
        // check if the user already liked the post!
        checkIfUserLikedPostAlready(REQUEST_BODY.userId, REQUEST_BODY.id , (err,result) => {
            if (err) {
                return cb(err,null);
            }
            if (result) {
                return cb(null, 'Already exist!');
            }else {
                Post.findOneAndUpdate({ _id: POST_ID }, INTERACTION_TYPE, (err, response) => {
                    updateUserLikes(REQUEST_BODY.userId,REQUEST_BODY.id, (err,result) => {
                        if(err) return cb(null,'likes not updated for user!');
                        return cb(null, 'Sucessfully updated likes for user!')
                    })
                })
            }
        })
    }
    // other than LIKES
    else {
        // update the post 
        Post.findOneAndUpdate({ _id: POST_ID }, INTERACTION_TYPE, (err, response) => {
            if (err) {
                return cb(err, null);
            }
            else {
                if (REQUEST_BODY.action === 'COMMENT') {
                    // save the commment onto the database
                    if (!addCommentToPost(COMMENT_BODY,POST_ID,REQUEST_BODY.replyTo)) {
                        return cb(null,'comment not saved successfully!')
                    }
                }
                return cb(null, 'successfully updated!');
            }
        })
    }
    
}

// function to get all of the posts of that user and returns a callback
const getUsersPost = (USER_ID, cb) => {
    Post.find({ userid: USER_ID }, (err, posts) => {
        return err ? cb(err,null) : cb(null,posts)
    })
}

// function to get all posts of all users and return a callbacl
const getAllPosts = (cb) => {
    Post.find({}, (err, posts) => { 
        return err ? cb(err,null) : cb(null,posts)
    })
}

function checkIfUserLikedPostAlready(userId,postId,callb) {
    // get all the likes from the user
    Likes.findOne({userId:userId}, (err,likes) => {
        if (err) return callb(err,null);
        if (!likes) return callb(null,false);
        if (likes.likes.includes(postId)) {
            return callb(null,true);
        }else {
            return callb(null,false);
        }
    })
}

// function to add the comment to the post
/**
 * @param {Object} COMMENT - an object that contains the data of the comment
 * @param {String} postId - the ID of a specfic post
 */
function addCommentToPost(COMMENT, postId, replyToUser) {
    console.log(COMMENT)
    // check to see if the user post exist in comment collection
    Comment.findOne({postId:postId} , (err,post) => {
        if (err) {
            console.log(err)
            return false;
        }
        if (!post) { // create the new comment schema, and update the post
            let NEW_COMMENT = new Comment({
                postId:postId,
                comments:[COMMENT],
                replyTo:replyToUser
            })
            NEW_COMMENT.save((err,data) => {
                return err ? false : true;
            })
        }else { // update the existing post, pushing the reply to the comments array
            Comment.updateOne({postId:postId},{$push:{comments:COMMENT}}, (err,success) =>{
               return err ? false : true;
            })
        }
    })
}

// function to add the new likes to the collection for that user
/**
 * This function will update the user's likes
 * @param {String} postId - the ID of a specfic post
 * @param {String} userId - the ID of a specfic user
 * @param {Function} cb - a callback function 
 */
function updateUserLikes(userId, postId, cb) {
    console.log(userId, postId)
    // check to see if the user post exist in comment collection
    Likes.findOne({userId:userId} , (err,like) => {
        if (err) {
            return cb(err,null);
        }
        if (!like) { // create the new comment schema, and update the likes
            let NEW_LIKES = new Likes({
                userId:userId,
                likes: [postId]
            })
            NEW_LIKES.save((err,data) => {
                return err ? cb(err,null) : cb(null,true)
            })
        }else { // update the existing post, pushing the new post to the user's likes array
            Likes.updateOne({userId:userId},{$push:{likes:postId}}, (err,success) =>{
                 return err ? cb(err,null) : cb(null,success)
            })
        }
    })
}

//  function to get the user's thread with comments
function getUserThreadAndComments(postId, cb) {
    let thread = {}
    // query to get the specfic post
    Post.findOne({_id:postId} , (err,post) => {
        thread['post'] = post
        if (err) return cb('Error retrieving post', null);
        Comment.findOne({postId:postId} , (err,data) => {
            thread['comments'] = data
            return err ? cb('Error retrieving comments', null) : cb(null, thread)
        })
    })
}

// function to get all of the user's liked post ids
function getPostIdsOfUsersLikes(userId, cb) {
    // get all the likes from the user
    Likes.findOne({userId:userId}, (err,likes) => {
        console.log(likes)
        if (err) return cb(err,null);
        if (!likes) return cb(null,[]);
        else {
            let likes_arr = convertToMongooseObjectIdsArray(likes.likes)
            
            Post.find({_id:{$in:likes_arr}}, (err,posts) => {
                if (err) return cb(err,null);
                else {
                    return cb(null,posts)
                }
            })
        }
    })
}

// convert the array of strings to mongoose object ID types
function convertToMongooseObjectIdsArray(string_arrs) {
    for(var index in string_arrs) {
        string_arrs[index] = mongoose.Types.ObjectId(string_arrs[index])
    }
    return string_arrs;
}

module.exports = {
    postTheTweet: postTheTweet,
    updatePostInteraction: updatePostInteraction,
    getUsersPost: getUsersPost,
    getAllPosts: getAllPosts,
    getUserThreadAndComments:getUserThreadAndComments,
    getPostIdsOfUsersLikes:getPostIdsOfUsersLikes
}