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
router.get('/profile' , (req,res) => {
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
router.post('/tweet/post', (req,res) => {
    
    post = new Post(req.body)
    // set the date for the post before saving it
    post['date'] = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    post.save((err,data) => {
        if (err) return res.send(err)
        else return res.send(data)
    })
})

// endpoint to logout
router.post('/logout', (req,res) => {
    req.logOut();
    res.send('successfully logged out!')
})
module.exports = router;