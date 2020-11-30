const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name : { type:String, required:true },
    phone : { type:String, required:true, maxlength:10 },
    password : { type:String, required:true },
    birth : { type:String, required:true },
})

var User = mongoose.model('User',userSchema);
module.exports = User;