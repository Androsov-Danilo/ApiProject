const express = require('express')
const router = express.Router()
const apiKeyDB = require('../db/apiKey.js')
const categoryDB = require('../db/category.js')
const userDB = require('../db/User.js')

router.post('/', (req, res) => {
    const apiKeyUser = req.headers['api-key']
    
    if(!apiKeyUser){
        res.status(403).send('Add apikey to headers')
    }else{
        apiKeyDB.isKey(apiKeyUser, (errDb, resDBKey)=>{
            const rowsKey = resDBKey.rows
            if(rowsKey.lenght < 1){
                res.status(403).send('api-key is invalid')
            }else{
                userDB.getUserByApiKey(apiKeyUser, (resDBUser)=>{
                    const userApiKey = resDBUser.rows
                    if (userApiKey[0].admin != true){
                        res.status(403).send("You didn't have access")
                    }else{
                        const name = req.body.name
                        if(name == undefined){
                            res.status(400).send('add name')
                        }else{
                            categoryDB.addCategory(name)
                            res.sendStatus(201)
                        }
                    }
                })
            }
        })
    }
})

module.exports = router