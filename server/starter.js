const { app } = require('./server')
const PORT = process.env.PORT || 3001
// listen to port
app.listen(PORT, () => console.log(`listening on port ${PORT}`))
