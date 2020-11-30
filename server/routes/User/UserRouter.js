const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../../model/userSchema')
const bcrypt = require('bcrypt')
require('dotenv').config()

mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true , useNewUrlParser: true}); // connect to the database

// sign up endpoint
router.post('/signup', async (req,res) => {
    // hash the password before storing into db
    let hashed_password = await bcrypt.hash(req.body.password, 10);
    let user = new User ({
        name: req.body.name,
        phone: req.body.phone,
        password: hashed_password,
        birth: req.body.birthday,
    })
    // save onto the database
    user.save((err,data) => {
        if (err) return res.send(err)
        else return res.send(data)
    })
})

// sign in endpoint
router.post('/signin', checkIfUserExist, async (req,res) => {
    res.send('inside the sign in');
})

// middleware function to check if the user's phone number exist
function checkIfUserExist (req,res,next) {
    User.findOne({phone:req.body.phone},(err,data) =>{
        if (err) return res.send('error trying to find user')
        return (!data) ?  res.send('user does not exist') : next();
    })
}

module.exports = router;