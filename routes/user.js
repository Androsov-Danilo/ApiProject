const express = require('express')
const router = express.Router()
const apiKeyDB = require('../db/apiKey.js')
const userDB = require('../db/User.js')

router.post('/',(req,res)=>{
    const apiKeyUser = req.headers['api-key']
    if(!apiKeyUser){
        res.status(403).send('Add apikey to headers')
    } else {
        apiKeyDB.isKey(apiKeyUser, (errDb, resDBKey)=>{
            const rowsKey = resDBKey.rows
            if(rowsKey.lenght < 1){
                res.status(403).send('api-key is invalid')
            }else{
                const firstName = req.body.firstName
                const userName = req.body.userName
                const admin = req.body.admin
                const apikey = req.body.apikey
                if(firstName == undefined){
                    res.status(400).send('add firstname')
                }else if (userName == undefined){
                    res.status(400).send('add username')
                }else if (admin == undefined){
                    res.status(400).send('add admin')
                }else{
                    console.log('cfgvhjkl')
                    userDB.addUser(firstName, userName, admin, apikey)
                    res.sendStatus(201)
                }
                
                // res.send(userRows)
                // res.sendStatus(201)
            }          
        })
    }
})

router.get('/:id', (req, res) => {
    const userId = req.params.id;

    const foundUser = apiKeyDB.getUserById(userId);

    if (foundUser) {
        res.status(200).json(foundUser);
    } else {
        res.status(404).json({ status: 404, message: 'User not found' });
    }
});

router.delete('/:id', (req, res) => {
    const userId = req.params.id;

    const deletedUser = apiKeyDB.deleteUserById(userId);

    if (deletedUser) {
        res.status(200).json({ status: 200, message: 'User deleted successfully' });
    } else {
        res.status(404).json({ status: 404, message: 'User not found' });
    }
});


router.get('/', (req, res)=>{
    const apiKeyUser = req.headers['api-key']
    const admineUser = req.body.admin
    console.log(req.body)
    if(admineUser === false) {
        res.status(403).send("You didn't have access")
    }else{
        if(!apiKeyUser) {
            res.status(403).send('Add apikey to headers')
        }else{
            apiKeyDB.isKey(apiKeyUser,(errDb, resDBKey) =>{
                const rowsKey = resDBKey.rows
                if(rowsKey.lenght < 1){
                    res.status(403).send('api-key is invalid')
                }else{
                    userDB.getAllUser((resDBUser)=>{
                        const rowsUser = resDBUser.rows
                        console.log(rowsUser)
                        if(rowsUser.lenght < 1){
                            res.status(404).send('User does not exist')
                        }else(
                            res.send(rowsUser)
                        )
                    })
                }
            })
        }
    }
})

module.exports = router;