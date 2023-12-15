const express = require('express')
const router = express.Router()
const apiKeyDB = require('../db/apiKey.js')
const userDB = require('../db/User.js')

router.post('/', (req, res) => {
    const ApiKey = apiKeyDB.addApiKey()
    res.send(ApiKey)
});

module.exports = router;