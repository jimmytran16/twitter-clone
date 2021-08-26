const mongoose = require('mongoose');

// COMMENTS SCHEMA
/* 
post_id : {
            reply_data: 'this is a response' , 
            user_id:'<some user id>' ,
            username: '<some user name>',
        },
        {
            reply_data: 'this is a response' , 
            user_id:'<some user id>' ,
            username: '<some user name>',
        }
}
*/

var commentSchema = new mongoose.Schema({
    postId : { type:String, required:true },
    comments : { type:Array, required:true },
    replyTo: { type:String, required:true }
})

var Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;