const Post = require('../../model/postSchema')

// function to post the tweet, and will return a callback
const postTheTweet = (TWEET_INFO , cb) => {
    post = new Post(TWEET_INFO)
    // set the date for the post before saving it
    post['date'] = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    post.save((err,data) => {
        if (err) { 
            cb(err,null)
            return
        }
        else {
            cb(null,data)
        }
    })
}

// function will try to update the post's interaction and send back a callback
const updatePostInteraction = (REQUEST_BODY, cb) => {
    // check if the the body's data contains all data
    if (!REQUEST_BODY || !REQUEST_BODY.action || !REQUEST_BODY.id) {
        cb('id and action required in request body!',null);
        return;
    }
    let INTERACTION_TYPE;
    let POST_ID = REQUEST_BODY.id;
    // switch case to determine which action the user took
    switch(REQUEST_BODY.action) {
        case 'RETWEETS':
            INTERACTION_TYPE = {$inc:{retweets:1}}
            break;
        case 'LIKES':
            INTERACTION_TYPE = {$inc:{likes:1}}
            break;
        case 'COMMENT':
            INTERACTION_TYPE = {$inc:{retweets:1}}
            break;
        case 'LINKOFF':
            INTERACTION_TYPE = {$inc:{likes:1}}
            break;
        default:
            cb('ACTION INVALID', null);
            return;
    }
    // update the post 
    Post.findOneAndUpdate({_id : POST_ID }, INTERACTION_TYPE, (err, response) => {
        if (err) {
            cb(err,null);
        }
        else {
            cb(null, 'Sucessfully Updated!')
        }
    })
}

// function to get all of the posts of that user and returns a callback
const getUsersPost = (USER_ID, cb) => {
    Post.find({userid:USER_ID}, (err,posts) => {
        if (err) return cb(err,null);
        else return cb(null,posts);
    })
}

// function to get all posts of all users and return a callbacl
const getAllPosts = (cb) => {
    Post.find({}, (err,posts) => {
        if (err)
            return cb(err,null);
        else 
            return cb(null,posts);
    })
}

module.exports = {
    postTheTweet:postTheTweet,
    updatePostInteraction:updatePostInteraction,
    getUsersPost:getUsersPost,
    getAllPosts:getAllPosts
}