const mongoose = require('mongoose');

// schema to keep track of the user's likes
var likesSchema = new mongoose.Schema({
    userId: { type:String, required:true },
    likes: { type:Array, required:true } // stores the postIds 
})

var Likes = mongoose.model('Like',likesSchema);
module.exports = Likes;