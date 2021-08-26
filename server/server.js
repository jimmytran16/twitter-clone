// required modules
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const mainRouter = require('./src/routes/main.route')
const authRouter = require('./src/routes/auth.route')
const userRouter = require('./src/routes/user.route')
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
  credentials: true
}))
app.use(morgan('dev'))

// routers
app.use('/', mainRouter);
app.use('/home', userRouter);
app.use('/auth', authRouter);

// export the app
module.exports = { app } 
