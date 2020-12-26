// required modules
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const MainRouter = require('./routes/Main/MainRouter')
const UserActionRouter = require('./routes/User/UserActionRouter')
const UserAuthLogin = require('./routes/Auth/LoginRouter')
const morgan = require('morgan')

//test 
const multer = require('multer')
const { Storage } = require('@google-cloud/storage');
const User = require('./model/userSchema')

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
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(req.body)
  }
  next()
})

// routers
app.use('/', MainRouter);
app.use('/home', UserActionRouter);
app.use('/auth', UserAuthLogin);

//// TESTTTTTTT UPLOAD
// Create new storage instance with Firebase project credentials
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
});

// Create a bucket associated to Firebase storage bucket
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

// Initiating a memory storage engine to store files as Buffer objects
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
  },
});

//test endpoint for upload
app.post('/upload', uploader.single('file'), (req, res, next) => {
  try {
    console.log(req.body.userId)
    if (!req.file) {
      res.status(400).send('Error, could not upload file');
      return;
    }
    // get the user id
    let userId = req.body.userId

    // Create new blob in the bucket referencing the file
    const blob = bucket.file(req.file.originalname);

    User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { profileUrl: encodeURI(blob.name) }, (err, result) => {
      if (err) { return res.send('error saving new profile url'); res.end(); }
      // Create writable stream and specifying file mimetype
      else {
        const blobWriter = blob.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });
  
        blobWriter.on('error', (err) => next(err));
  
        blobWriter.on('finish', () => {
          // Assembling public URL for accessing the file via HTTP
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name
            }/o/${encodeURI(blob.name)}?alt=media`;
  
          // Return the file name and its public URL
          res
            .status(200)
            .send({ fileName: req.file.originalname, fileLocation: publicUrl });
        });
  
        // When there is no more data to be consumed from the stream
        blobWriter.end(req.file.buffer);
      }
    })



  } catch (error) {
    res.status(400).send(`Error, could not upload file: ${error}`);
    return;
  }
})

function uploadUserProfile(profileUrl) {

}

// export the app
module.exports = { app } 
