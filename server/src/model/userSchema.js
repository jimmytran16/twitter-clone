const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name : { type:String, required:true },
    username: { type:String, required:true },
    phone : { type:String, required:true, maxlength:10 },
    password : { type:String, required:true },
    birth : { type:String, required:true },
    profileUrl: { type:String, required:false }
})

var User = mongoose.model('User',userSchema);
module.exports = User;