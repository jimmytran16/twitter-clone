// required modules
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const SignUpRouter = require('./routes/User/UserRouter')
const MainRouter = require('./routes/Main/MainRouter')
const UserActionRouter = require('./routes/UserAction/UserActionRouter')
const UserAuthLogin = require('./routes/Auth/LoginRouter')
const morgan = require('morgan')

// middlewares
app.use(express.json())
app.use(express.urlencoded())
app.use(cors({
  origin:'http://localhost:3000',
  credentials:true
}))
app.use(morgan('dev'))
app.use(
    session({
      secret: "secretcode",
      resave: false,
      saveUninitialized: false,
    })
  );
app.use(cookieParser("secretcode"))
app.use(passport.initialize())
require('./passportConfig')(passport)


// routers
app.use('/', MainRouter);
app.use('/user',SignUpRouter);
app.use('/home',UserActionRouter);
app.use('/auth', UserAuthLogin(passport));

// connect to the database
mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true , useNewUrlParser: true}, (err) => err ? console.log('error connecting to the db') : console.log('connected to db successfully')); // connect to the database

// export the app
module.exports = { app } 
