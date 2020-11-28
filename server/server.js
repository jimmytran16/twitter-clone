const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = process.env.PORT || 3001

// middlewares
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())



// listen to port
app.listen(PORT, () => console.log(`listening on port ${PORT}`))



