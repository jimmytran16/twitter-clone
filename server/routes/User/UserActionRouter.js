const express = require('express')
const router = express.Router()
const Post = require('../../model/postSchema')

// route for the user's dashboard (retrieve the tweets)
router.get('/', (req,res) => {
    Post.find({}, (err,data) => {
        if (err) {
            return res.json({
                data:err,
                success:false
            })
        }
        else {
            return res.status(200).json({
                data:data,
                success:true
            })
        }
    })
})

// endpoint to get the specific user's post 
router.get('/profile' , checkIfAuth, (req,res) => {
    //  get user's post based on ID
    console.log(req.query.userid);
    console.log('inside profile')
    Post.find({userid:req.query.userid}, (err,posts) => {
        if (err) return res.send(err)
        else {
            res.json({
                data:posts,
                success:true
            })
        }
    })
})

// endpoint for the user to tweet
router.post('/tweet/post', checkIfAuth, (req,res) => {
    
    post = new Post(req.body)
    // set the date for the post before saving it
    post['date'] = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    post.save((err,data) => {
        if (err) return res.send(err)
        else return res.send(data)
    })
})

// endpoint for user to like a post
router.post('/interaction', checkIfAuth, (req,res) => {
    console.log(req.body)
    // check if the the body's data contains all data
    if (!req.body || !req.body.action || !req.body.id) {
        res.json({
            message:'id and action required in request body!',
            success:false
        })
    }
    let INTERACTION_TYPE;
    // switch case to determine which action the user took
    switch(req.body.action) {
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
            res.json({
                message:'ACTION INVALID',
                success:false
            })
            break;
    }
    // update the post 
    Post.findOneAndUpdate({_id : req.body.id }, INTERACTION_TYPE, (err, response) => {
        if (err) {
            return res.json({
                message:err,
                success:false
            })
        }
        else {
            return res.json({
                message:'Successfully updated',
                success:true
            })
        }
    })
})

// middleware function to check if the user is authorized
function checkIfAuth (req,res,next) {
    console.log(req.session)
    if (!req.session.passport || !req.session.passport.user) {
        return res.json({
            message: 'No authorization',
            success: false
        })
    }
    next();
}

// endpoint to logout
router.post('/logout', (req,res) => {
    req.logOut();
    res.send('successfully logged out!')
})
module.exports = router;