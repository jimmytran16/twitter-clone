const express = require('express')
const app = express()
const cors = require('cors')
const SignUpRouter = require('./routes/User/UserRouter')
const MainRouter = require('./routes/Main/MainRouter')
const UserActionRouter = require('./routes/UserAction/UserActionRouter')
const PORT = process.env.PORT || 3001

// middlewares
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.use('/', MainRouter);
app.use('/user',SignUpRouter);
app.use('/home',UserActionRouter);

// listen to port
app.listen(PORT, () => console.log(`listening on port ${PORT}`))
