/* in your router file */
const router = require('express').Router();
const User = require('../../model/userSchema');

var loginRoutes = function(passport){
    // sign in endpoint
    router.post('/signin', checkIfUserExist , (req,res, next) => {
        console.log(req.body)
        passport.authenticate("local", (err,user,info) => {
            if (err) throw err;
            if (!user) {
                res.json({
                    message:'No User Exists!',
                    success:false
                })
            }
            else {
                req.logIn(user,err => {
                    if (err) throw err;
                    return res.json({
                        message:req.user,
                        success: true
                    })
                })
            }
        })(req,res,next)
    })

    return router;
};

// middleware function to check if the user's phone number exist
function checkIfUserExist (req,res,next) {
    User.findOne({username:req.body.username},(err,data) =>{
        if (err) return res.send('ERROR querying DATABASE')
        return (!data) ?  res.json({message:'User does not exists!',success:false}) : next();
    })
}


module.exports = loginRoutes;
