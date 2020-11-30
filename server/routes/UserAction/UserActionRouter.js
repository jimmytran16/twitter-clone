const e = require('express')
const express = require('express')
const router = express.Router()
const Post = require('../../model/postSchema')

// route for the user's dashboard
router.get('/', (req,res) => {
    Post.find({}, (err,data) => {
        if (err) {
            return res.json({
                data:err,
                success:false
            })
        }
        else {
            return res.json({
                data:data,
                success:true
            })
        }
    })
})

// endpoint for the user to tweet
router.post('/tweet/post', (req,res) => {
    
    post = new Post(req.body)

    post.save((err,data) => {
        if (err) return res.send(err)
        else return res.send(data)
    })
})
module.exports = router;