const express = require('express')
const router = express.Router()
const apiKeyDB = require('../db/apiKey.js')
const userDB = require('../db/User.js')

router.post('/', (req, res) => {
    const ApiKey = apiKeyDB.addApiKey()
    res.send(ApiKey)
});

router.get('/', (req, res) => {
    const userApiKey = req.headers['api-key'];

    if (!userApiKey) {
        return res.status(403).send('ApiKey is invalid');
    }

    userDB.getUserByApiKey(userApiKey, (resDBUser) => {
        const user = resDBUser.rows[0];

        if (!user) {
            return res.status(404).send('User didn’t exist');
        }

        return res.status(200).send(userApiKey)
    });
});

module.exports = router;