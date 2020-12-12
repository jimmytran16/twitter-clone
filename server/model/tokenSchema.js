var mongoose = require('mongoose');

// create a refresh tokens schema
var refreshTokensSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    token:{ type: String, required: true },
    date: { type: Date, required: false },
    expiration: { type: String, required: true },
});
 
var refreshTokens = mongoose.model('RefreshToken', refreshTokensSchema);
module.exports = refreshTokens;