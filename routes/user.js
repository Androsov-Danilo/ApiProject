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
    const apiKeyUser = req.headers['api-key'];

    if (!apiKeyUser) {
        return resDel.status(403).send('Add api-key to headers');
    }

    if (apiKeyUser.length < 1) {
        return resDel.status(403).send('Apikey is invalid');
    }

    userDB.getUserByApiKey(apiKeyUser, (resDBUser) => {
        const userApiKey = resDBUser.rows;

        if (!userApiKey || userApiKey.length < 1 || userApiKey[0].admin !== true) {
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
                console.log(adminUser.admin)
                if(rowsKey.length < 1){
                    return res.status(403).send('api-key is invalid')
                }else if(!adminUser.admin){
                    res.status(403).send('You didnt have access')
                }else{ 
                    const deletedUser = userDB.delUser(userId);
                    if (deletedUser) {
                        res.status(404).json({ status: 404, message: 'User didn’t delete'});
                    } else {
                        res.status(204).send('User was deleted')    
                    }
                    
                    
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
    //}
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
            }
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
        })
        }
    })


module.exports = router;