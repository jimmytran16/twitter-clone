const express = require('express')
const router = express.Router()

router.post('/', (req,res) => {
    res.json({
        message: 'Welcome to the Twitter Clone API'
    })
})

module.exports = router;