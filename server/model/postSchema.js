const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    username : { type:String, required:true },
    tweet : { type:String, required:true },
    date : { type:Date, required:true },
    retweets : { type:Number, required:false, default:0 },
    likes : { type:Number, required:false, default:0 }
})

var Post = mongoose.model('Post',postSchema);
module.exports = Post;