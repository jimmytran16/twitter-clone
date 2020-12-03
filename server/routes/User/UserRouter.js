const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../../model/userSchema')
const bcrypt = require('bcrypt')
require('dotenv').config()

// sign up endpoint
router.post('/signup', async (req,res) => {
    // hash the password before storing into db
    let hashed_password = await bcrypt.hash(req.body.password, 10);
    let user = new User ({
        name: req.body.name,
        phone: req.body.phone,
        password: hashed_password,
        birth: req.body.birthday,
        username:req.body.username
    })
    // save onto the database
    user.save((err,data) => {
        if (err) return res.send(err)
        else return res.send(data)
    })
})

router.post('/logout', (req,res) => {
    req.logOut();
    res.send('successfully logged out!')
})

router.get('/userdata', (req,res) => {
    console.log(req._passport);
    res.send(req.session);
})

// // sign in endpoint
// router.post('/signin', checkIfUserExist , (req,res, next) => {
//     passport.authenticate("local", (err,user,info) => {
//         if (err) throw err;
//         if (!user) res.send("No User exists!");
//         else {
//             req.logIn(user,err => {
//                 if (err) throw err;
//                 res.send(req.user);
//             })
//         }
//     })(req,res,next)
// })

// // middleware function to check if the user's phone number exist
// function checkIfUserExist (req,res,next) {
//     User.findOne({phone:req.body.phone},(err,data) =>{
//         if (err) return res.send('error trying to find user')
//         return (!data) ?  res.send('user does not exist') : next();
//     })
// }

module.exports = router;