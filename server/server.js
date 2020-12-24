// required modules
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const MainRouter = require('./routes/Main/MainRouter')
const UserActionRouter = require('./routes/User/UserActionRouter')
const UserAuthLogin = require('./routes/Auth/LoginRouter')
const morgan = require('morgan')

// configure the development .env file
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
// connect to the database
mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => err ? console.log('error connecting to the db') : console.log('connected to db successfully')); // connect to the database

// middlewares
app.use(express.json())
app.use(express.urlencoded())
app.use(cors({
  origin: process.env.ORIGIN_URL,
  credentials:true
}))
app.use(morgan('dev'))
app.use((req,res,next) => {
  if (req.method === 'POST') {
    console.log(req.body)
  }
  next()
})

// routers
app.use('/', MainRouter);
app.use('/home', UserActionRouter);
app.use('/auth', UserAuthLogin);

// export the app
module.exports = { app } 
