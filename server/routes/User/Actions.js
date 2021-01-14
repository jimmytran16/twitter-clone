const Post = require('../../model/postSchema')
const User = require('../../model/userSchema')
const Comment = require('../../model/commentSchema')
const Likes = require('../../model/likesSchema')
const mongoose = require('mongoose')
const { Storage } = require('@google-cloud/storage');
const bcrypt = require('bcrypt')

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// function to post the tweet, and will return a callback
const postTheTweet = (TWEET_INFO, cb) => {
    let post = new Post(TWEET_INFO)
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

const deleteTweet = (TWEET_ID, cb) => {
    Post.remove({ _id: mongoose.Types.ObjectId(TWEET_ID) }, (err, result) => {
        return err ? cb(err, null) : cb(null, result)
    })
}
/**
 * function will try to update the post's interaction and send back a callback
 * @param {Object} REQUEST_BODY - the request body object containing data from webapage
 * @param {Function} cb - a callback function 
 */
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
        checkIfUserLikedPostAlready(REQUEST_BODY.userId, REQUEST_BODY.id, (err, result) => {
            if (err) {
                return cb(err, null);
            }
            if (result) {
                return cb(null, 'Already exist!');
            } else {
                Post.findOneAndUpdate({ _id: POST_ID }, INTERACTION_TYPE, (err, response) => {
                    updateUserLikes(REQUEST_BODY.userId, REQUEST_BODY.id, (err, result) => {
                        if (err) return cb(null, 'likes not updated for user!');
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
                    if (!addCommentToPost(COMMENT_BODY, POST_ID, REQUEST_BODY.replyTo)) {
                        return cb(null, 'comment not saved successfully!')
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
        return err ? cb(err, null) : cb(null, posts)
    })
}

// function to get all posts of all users and return a callbacl
const getAllPosts = (cb) => {
    Post.find({}).lean().exec((err, posts) => { // return posts in native JS objects 
        User.find({})
            .select('_id profileUrl') // retrieve ONLY the profileUrl and the _id
            .lean()
            .exec(function (err, order) {
                let users = {}
                // populate the user object with the id : profileUrl
                for (var i = 0; i < order.length; i++) {
                    users[order[i]._id.toString()] = order[i].profileUrl
                }
                // loop through the posts and map the profileUrls to its respective posts
                for (var x = 0; x < posts.length; x++) {
                    posts[x].profileUrl = users[posts[x].userid]
                }

                return err ? cb(err, null) : cb(null, posts)
            });
    })
}


function checkIfUserLikedPostAlready(userId, postId, callb) {
    // get all the likes from the user
    Likes.findOne({ userId: userId }, (err, likes) => {
        if (err) return callb(err, null);
        if (!likes) return callb(null, false);
        // if the user liked the post then we will unlike it
        if (likes.likes.includes(postId)) {
            unlikeThePost(userId, postId)
            return callb(null, true);
        } else {
            return callb(null, false);
        }
    })
}

function unlikeThePost(userId, postId) {
    Post.findOneAndUpdate({ _id: mongoose.Types.ObjectId(postId) }, { $inc: { likes: -1 } }, (err, result) => {
        if (err) { console.log('erroring out the on unlikeing the tweet') }
        else {
            // query the likes document of that user and remove the post id that the user liked from the arr
            Likes.updateOne({ userId: userId }, { $pullAll: { likes: [postId] } }, (err, result) => {
                if (err) { console.log(err) }
                else {
                    console.log('successfully removed the postId from the array')
                }
            })
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
    Comment.findOne({ postId: postId }, (err, post) => {
        if (err) {
            console.log(err)
            return false;
        }
        if (!post) { // create the new comment schema, and update the post
            let NEW_COMMENT = new Comment({
                postId: postId,
                comments: [COMMENT],
                replyTo: replyToUser
            })
            NEW_COMMENT.save((err, data) => {
                return err ? false : true;
            })
        } else { // update the existing post, pushing the reply to the comments array
            Comment.updateOne({ postId: postId }, { $push: { comments: COMMENT } }, (err, success) => {
                return err ? false : true;
            })
        }
    })
}

/**
 * This function will update the user's likes
 * @param {String} postId - the ID of a specfic post
 * @param {String} userId - the ID of a specfic user
 * @param {Function} cb - a callback function 
 */
function updateUserLikes(userId, postId, cb) {
    console.log(userId, postId)
    // check to see if the user post exist in comment collection
    Likes.findOne({ userId: userId }, (err, like) => {
        if (err) {
            return cb(err, null);
        }
        if (!like) { // create the new comment schema, and update the likes
            let NEW_LIKES = new Likes({
                userId: userId,
                likes: [postId]
            })
            NEW_LIKES.save((err, data) => {
                return err ? cb(err, null) : cb(null, true)
            })
        } else { // update the existing post, pushing the new post to the user's likes array
            Likes.updateOne({ userId: userId }, { $push: { likes: postId } }, (err, success) => {
                return err ? cb(err, null) : cb(null, success)
            })
        }
    })
}

//  function to get the user's thread with comments
function getUserThreadAndComments(postId, cb) {
    let thread = {}
    // query to get the specfic post
    Post.findOne({ _id: postId }, (err, post) => {
        thread['post'] = post
        if (err) return cb('Error retrieving post', null);
        Comment.findOne({ postId: postId }, (err, data) => {
            thread['comments'] = data
            return err ? cb('Error retrieving comments', null) : cb(null, thread)
        })
    })
}
/**
 * Get all of the User likes and the corresponding profileUrls of those liked posts
 * @param {String} userId - the ID of a specfic user
 * @param {Function} cb - a callback function 
 */
function getPostIdsOfUsersLikes(userId, cb) {
    // get all the likes from the user
    Likes.findOne({ userId: userId }, (err, likes) => {
        console.log(likes)
        if (err) return cb(err, null);
        if (!likes) return cb(null, []);
        else {
            let likes_arr = convertToMongooseObjectIdsArray(likes.likes)
            // get all the posts based on the post ids, that is liked by the user
            Post.find({ _id: { $in: likes_arr } }).lean().exec((err, posts) => {
                if (err) return cb(err, null);
                else {
                    // GET all the users with its respective ids and profileUrls so we can include it inside the post objects
                    User.find({})
                        .select('_id profileUrl')
                        .lean()
                        .exec(function (err, order) {
                            let users = {}
                            // populate the user object with the id : profileUrl
                            for (var i = 0; i < order.length; i++) {
                                users[order[i]._id.toString()] = order[i].profileUrl
                            }
                            // loop through the posts and map the profileUrls to its respective posts
                            for (var x = 0; x < posts.length; x++) {
                                posts[x].profileUrl = users[posts[x].userid]
                            }

                            return err ? cb(err, null) : cb(null, posts)
                        });
                }
            })
        }
    })
}

async function editSettings (REQ_BODY, cb) {
    let userId = REQ_BODY.userId;
    let newName = REQ_BODY.newName;
    let newPassword = await bcrypt.hash(REQ_BODY.newPassword, parseInt(process.env.HASH_ITERATION));
    let newPhoneNumber = REQ_BODY.newPhoneNumber;

    let modifiedBody = {
        name: newName,
        password:newPassword,
        phone:newPhoneNumber,
    }

    console.log(modifiedBody)
    User.findOneAndUpdate({_id: mongoose.Types.ObjectId(userId) }, modifiedBody , (err,result) =>{
        if (err) { return cb(err,null) }
        else {
            return cb(null, result)
        }
    })
}

// convert the array of strings to mongoose object ID types
function convertToMongooseObjectIdsArray(string_arrs) {
    for (var index in string_arrs) {
        string_arrs[index] = mongoose.Types.ObjectId(string_arrs[index])
    }
    return string_arrs;
}

/**
 * Firebase Configurations
 */
// Create new storage instance with Firebase project credentials
const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
});

// Create a bucket associated to Firebase storage bucket
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

/**
 * function to upload the user profile picture to firebase, and update user's profileUrl
 * @param {Object} REQ_BODY - the body object containing the request's body
 * @param {Object} REQ_FILE - the file object containing the files data 
 * @param {Function} cb - a callback function 
 */
function uploadUserProfilePicture(REQ_BODY, REQ_FILE, cb) {
    try {
        console.log(REQ_BODY.userId)
        if (!REQ_FILE) {
            res.status(400).send('Error, could not upload file');
            cb('Error, could not upload file', null)
            return;
        }
        else {
            // get the user id
            let userId = REQ_BODY.userId

            // Create new blob in the bucket referencing the file
            const blob = bucket.file(REQ_FILE.originalname);

            User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { profileUrl: encodeURI(blob.name) }, (err, result) => {
                if (err) { cb(err, null) }
                // Create writable stream and specifying file mimetype
                else {
                    const blobWriter = blob.createWriteStream({
                        metadata: {
                            contentType: REQ_FILE.mimetype,
                        },
                    });

                    blobWriter.on('error', (err) => { return cb(err, null) });

                    blobWriter.on('finish', () => {
                        // Assembling public URL for accessing the file via HTTP
                        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name
                            }/o/${encodeURI(blob.name)}?alt=media`;
                        cb(null, {message:'Sucessfully uploaded profile picture!',savedData:{ fileName: REQ_FILE.originalname, fileLocation: publicUrl }})
                    });
                    // When there is no more data to be consumed from the stream
                    blobWriter.end(REQ_FILE.buffer);
                }
            })
        }

    } catch (error) {
        console.log('err', error)
        cb(`Error, could not upload file: ${error}`, null)
        return;
    }
}


module.exports = {
    postTheTweet: postTheTweet,
    updatePostInteraction: updatePostInteraction,
    getUsersPost: getUsersPost,
    getAllPosts: getAllPosts,
    getUserThreadAndComments: getUserThreadAndComments,
    getPostIdsOfUsersLikes: getPostIdsOfUsersLikes,
    deleteTweet: deleteTweet,
    uploadUserProfilePicture: uploadUserProfilePicture,
    editSettings:editSettings
}