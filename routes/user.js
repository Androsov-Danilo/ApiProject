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
                    userDB.addUser(firstName, userName, admin, apiKeyUser)
                    res.sendStatus(201)
                }
                
                // res.send(userRows)
                // res.sendStatus(201)
            }          
        })
    }
})

router.get('/:id', (req, resDel) => {
    const userId = req.params.id;
    const foundUser = userDB.getUser(userId);

    if (foundUser) {
        resDel.status(200).json(foundUser); 
    } else {
        resDel.status(404).json({ status: 404, message: 'User not found' }); 
    }
});

router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    const apiKeyfUser = req.headers['api-key']
    if(!apiKeyfUser){
        res.status(403).send('Add apikey to headers')
    } else {
        apiKeyDB.isKey(apiKeyfUser, (err, res)=>{
            const rowsKey = res.rows
            const isUserAdmin = userDB.verifyUser(apiKeyfUser)
            if(rowsKey.lenght < 1){
                res.status(403).send('api-key is invalid')
            }else if(isUserAdmin != 'true' ){
                    res.status(404).json({ status: 404, message: 'You didn`t have access'});
                    res.status(404).json({ status: 404, message: isUserAdmin});
            }else{ 
                const deletedUser = userDB.delUser(userId);
                if (deletedUser) {
                    res.status(404).json({ status: 404, message: 'User didn’t exist'});
                } else {
                    res.status(204).json({ status: 204, message: 'User deleted successfully' });    }
                
    }})
    }
})

router.get('/', (req, res)=>{
    const apiKeyUser = req.headers['api-key']
    const admineUser = req.body.admin
    if(!admineUser) {
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

router.put('/:id', (req, res)=>{
    const apiKeyUser = req.headers['api-key']
    if(!apiKeyUser) {
        res.status(403).send('Add apikey to headers')
    }else{
        userDB.getUserByApiKey(apiKeyUser, (resDBUser)=>{
            const userApiKey = resDBUser.rows
            if (userApiKey[0].admin != true){
                res.status(403).send("You didn't have access")
            }else{
                userDB.getUser(req.params.id,(resUser)=>{
                    const userId = resUser.rows
                    console.log(userId[0].firstName)
                    if (userId[0] === undefined){
                        res.status(404).send('User didn’t exist')
                    }else{
                        const firstName = req.body.firstName
                        const userName = req.body.userName
                        const admin = req.body.admin
                        if(firstName == undefined){
                            res.status(400).send('add firstname')
                        }else if (userName == undefined){
                            res.status(400).send('add username')
                        }else if (admin == undefined){
                            res.status(400).send('add admin')
                        }else{
                            
                            userDB.updateUserById(userId[0].firstName = firstName, userId[0].userName = userName, userId[0].admin = admin)
                            res.status(200).send('User update')
                        }
                    }
                })
            }
        })
    }
})


router.put('/', (req, res)=>{
    const apiKeyUser = req.headers['api-key']
    const userId = userDB.getUser(req.params.id)
    if(!apiKeyUser) {
        res.status(403).send('Add apikey to headers')
    }else{
            userDB.verifyUser(apiKeyUser,(errPut, resPut) =>{
                const userRows = resPut.rows
                if(userRows.lenght < 1){
                    res.status(403).send('api-key is invalid')
                }else{
                    const firstName = req.body.firstName
                    const userName = req.body.userName
                    if(firstName == undefined){
                        res.status(400).send('add firstname')
                    }else if (userName == undefined){
                        res.status(400).send('add username')
                    }else if (admin == undefined){
                        res.status(400).send('add admin')
                    }else{
                        userDB.updateUserById(firstName, userName, admin)
                        res.status(200).send('User update')
                    }
                }
            })
        }
    
    })


module.exports = router;