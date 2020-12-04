const router = require('express').Router();
const User = require('../../model/userSchema');
const bcrypt = require('bcrypt');

// main endpoint
router.get('/', (req,res) => {
    res.json({
        message: 'Welcome to the Twitter Clone API'
    })
})

// sign up endpoint
router.post('/signup', checkIfUsernameExists, async (req,res) => {
    // hash the password before storing into db
    let hashed_password = await bcrypt.hash(req.body.password, parseInt(process.env.HASH_ITERATION));
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
        else {
            return res.json({
                message:data,
                success:true
            })
        }
    })
})

// middleware function to check if the user exists already
function checkIfUsernameExists(req,res,next) {
    // query to find the user by the username
    User.findOne({username:req.body.username} , (err , user) =>{
        if (err) return res.send('error with checkIFUsernameExists()');
        if (!user) return next();

        return res.json({
            message: 'User already exists!',
            success:false
        })
    })
}
module.exports = router;