const express = require('express')
const router = express.Router()
const apiKeyDB = require('../db/apiKey.js')
const userDB = require('../db/User.js')
const questionDB = require('../db/question.js')

router.post('/',(req,res)=>{
    const apiKeyUser = req.headers['api-key']
    if(!apiKeyUser){
        res.status(403).send('Add apikey to headers')
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
            userDB.addUser(firstName, userName, admin, apiKeyUser)
            res.sendStatus(201)
        }
        
        // res.send(userRows)
        // res.sendStatus(201)
    }          
})

router.get('/:id', (req, resDel) => {
    const userId = req.params.id;
    const apiKeyUser = req.headers['api-key'];

    if (!apiKeyUser) {
        return resDel.status(403).send('Add api-key to headers');
    }

    userDB.getUserByApiKey(apiKeyUser, (resDBUser)=>{
        const userApiKey = resDBUser.rows
        if(userApiKey[0] === undefined){
            res.status(403).send('ApiKey is invalid')
        }
    })

    if (userApiKey[0].admin !== true) {
           return resDel.status(403).send("You didn't have access");
    }

    userDB.getUser(userId, (result) => {
        if (result.rows.length > 0) {
            const user = result.rows[0];
            resDel.status(200).send(user)
        } else {
            resDel.status(404).send('User didn’t exist');
        }
    });
});



router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    const apiKeyfUser = req.headers['api-key']
    if(!apiKeyfUser){
        return res.status(403).send('Add apikey to headers')
    }else{
        apiKeyDB.isKey(apiKeyfUser, (errDb, resDBKey)=>{
            const rowsKey = resDBKey.rows
            userDB.getUserByApiKey(apiKeyfUser, (resAdmin)=>{
                const adminUser = resAdmin.rows[0]
                if(rowsKey[0] === undefined){
                    return res.status(403).send('api-key is invalid')
                }else if(!adminUser.admin){
                    res.status(403).send('You didnt have access')
                    userDB.getUser(userId, (resUs)=>{
                        const user = resUs.rows
                        if(!user[0]){
                            res.status(404).send('User didn’t exist')
                        }else{ 
                            const deletedUser = userDB.delUser(userId);
                            if (deletedUser) {
                                res.status(404).json({ status: 404, message: 'User didn’t delete'});
                            } else {
                                res.status(204).send('User was deleted')    
                            }
                        }
                    })
                }
        })
        })

    } 
})

router.get('/', (req, res)=>{
    const apiKeyUser = req.headers['api-key']
    // const admineUser = req.body.admin
    // if(!admineUser) {
    //     res.status(403).send("You didn't have access")
    //}else{
        if(!apiKeyUser) {
            res.status(403).send('Add apikey to headers')
        }else{
                userDB.getUserByApiKey(apiKeyUser, (resDBUser)=>{
                    const userApiKey = resDBUser.rows
                    if(userApiKey[0] === undefined){
                        res.status(403).send('ApiKey is invalid')
                }else{
                    if (userApiKey[0].admin != true){
                        res.status(403).send("You didn't have access")
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
                }
            })
        }
})

router.put('/:id', (req, res)=>{
    const apiKeyUser = req.headers['api-key']
    if(!apiKeyUser) {
        res.status(403).send('Add apikey to headers')
    }else{
        userDB.getUserByApiKey(apiKeyUser, (resDBUser)=>{
            const userApiKey = resDBUser.rows
            if(userApiKey[0] === undefined){
                res.status(403).send('ApiKey is invalid')
            }else{
                if (userApiKey[0].admin != true){
                    res.status(403).send("You didn't have access")
                }else{
                    userDB.getUser(req.params.id,(resUser)=>{
                        const userId = resUser.rows[0]

                        if (userId === undefined){
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
                                userDB.updateUserById(req.params.id,firstName,userName,admin)
                                res.status(200).send('User update')
                            }
                        }
                    })
            }}
        })
    }
})


router.put('/', (req, res)=>{
    const apiKeyUser = req.headers['api-key']
    if(!apiKeyUser) {
        res.status(403).send('Add apikey to headers')
    }else{
        userDB.getUserByApiKey(apiKeyUser, (resUser)=>{
            const userId = resUser.rows[0]
            if (userApiKey[0] === undefined){
                res.status(403).send('ApiKey is invalid')
            }else{
                if (userId === undefined){
                    res.status(404).send('User didn’t exist')
                }else{
                    const firstName = req.body.firstName
                    const userName = req.body.userName
                    if(firstName == undefined){
                        res.status(400).send('add firstname')
                    }else if (userName == undefined){
                        res.status(400).send('add username')
                    }else{
                        userDB.updateUserByApiKey(req.headers['api-key'],firstName,userName)
                        res.status(200).send('User update')
                    }
                }   
            }
        })
        }
    })

router.get('/user/apikey', (req, res) => {
    const userApiKey = req.headers['api-key'];

    if (!userApiKey) {
        return res.status(403).send('Add apikey to headers');
    }

    userDB.getUserByApiKey(userApiKey, (resDBUser) => {
        const user = resDBUser.rows[0];

        if (userApiKey[0] === undefined){
            res.status(403).send('ApiKey is invalid')
        }

        if (!user) {
            return res.status(404).send('User didn’t exist');
        }

        return res.status(200).send(userApiKey)
    });
});

router.get('/:id/question', (req, res) => {
    const userApiKey = req.headers['api-key'];

    if (!userApiKey) {
        res.status(403).send('Add apikey to headers')
    }else{
        userDB.getUserByApiKey(userApiKey, (resDBUser) => {
            const user = resDBUser.rows
            if(!user[0]){
                res.status(403).send('ApiKey is invalid')
            }else{
                if (user[0].admin !== true){
                    res.status(403).send("You didn't have access")
                }else{
                    const userId = req.params.id
                    userDB.getUser(userId, (resDb) =>{
                        const userRows = resDb.rows
                        if (!userRows[0]){
                            res.status(404).send('User didn’t exist');
                        }else{
                            questionDB.getQuestionByUserId(userRows[0].id, (resQestion) =>{
                                const question = resQestion.rows
                                if(!question[0]){
                                    res.status(400).send('question doesn`t exist')
                                }else{
                                    res.status(200).send(question)
                                }
                            })
                        }
                    })
                }
            }
        })
    }
})


module.exports = router;