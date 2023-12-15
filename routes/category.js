const express = require('express')
const router = express.Router()
const apiKeyDB = require('../db/apiKey.js')
const questionDB = require('../db/question.js')
const categoryDB = require('../db/category.js')
const userDB = require('../db/User.js')

router.post('/', (req, res) => {
    const apiKeyUser = req.headers['api-key']
    
    if(!apiKeyUser){
        res.status(403).send('Add apikey to headers')
    }else{
        userDB.getUserByApiKey(apiKeyUser, (resDBUser)=>{
            const userApiKey = resDBUser.rows
            if(userApiKey[0] === undefined){
                res.status(403).send('ApiKey is invalid')
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
                            categoryDB.addCategory(`Category ${name} created `)
                            res.sendStatus(201)
                        }
                    }
                })
            }
        })
    }
})

router.get('/', (req, res)=>{
    const apiKeyUser = req.headers['api-key']
    if(!apiKeyUser){
        res.status(403).send('Add apikey to headers')
    }else{
        userDB.getUserByApiKey(apiKeyUser, (resDBUser)=>{
            const userApiKey = resDBUser.rows
            if(userApiKey[0] === undefined){
                res.status(403).send('ApiKey is invalid')
            }else{
                categoryDB.getAllCategory((resDBCategory)=>{
                    const category = resDBCategory.rows
                    res.status(200).send(category)
                })
            }
        })
    }
})

router.delete('/:id', (req, res) => {
    const apiKeyUser = req.headers['api-key']
    const categoryId = req.params.id

    if(!apiKeyUser){
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
                    categoryDB.getCategoryById(categoryId,(resDb)=>{
                        const category = resDb.rows
                        if(category[0] === undefined){
                            res.status(404).send('Category does not exist')
                        }else{
                            res.status(204).send('Category has been deleted')
                            categoryDB.delCategory(categoryId)
                        }
                    })
                }
            }
        })
    }
})

router.put('/:id', (req, res)=>{
    const apiKeyUser = req.headers['api-key']
    if (!apiKeyUser) {
        return res.status(403).send('Add api-key to headers');
    }else{
        userDB.getUserByApiKey(apiKeyUser, (resAdmin)=>{
            const isAdmin = resAdmin.rows[0] 
            if(isAdmin === undefined) {
                res.status(403).send('Apikey is invalid');
            }else{
                categoryDB.getCategoryById(req.params.id, (resCat)=>{
                    const categoryRows = resCat.rows
                    console.log(categoryRows[0])
                    if (categoryRows[0]){
                        const name = req.body.name
                        if(name == undefined){
                            res.status(400).send("add name")
                        }else if(!isAdmin.admin){
                            res.status(403).send('You didnt have access')
                        }else{
                            categoryDB.updateCategory(name, req.params.id)
                            res.status(200).send(`categoty with ${req.params.id} updated`)
                        }
                    }else{
                        res.status(404).send(`categoty doesn't exist`)
                    }
                })
            }
        })
        
    }
})

router.get('/:id/meta', (req, res)=>{
    const apiKeyUser = req.headers['api-key']
    let count = 0
    if (!apiKeyUser) {
        res.status(403).send('Add api-key to headers');
    }else{
        userDB.getUserByApiKey(apiKeyUser, (resAdmin)=>{
            const isAdmin = resAdmin.rows[0] 
            if(isAdmin === undefined) {
                res.status(403).send('Apikey is invalid');
            }else{
                const categoryId = req.params.id
                categoryDB.getCategoryById(categoryId,(resCt)=>{
                    const categoryRows = resCt.rows
                    if(!categoryRows[0]){
                        res.status(404).send(`categoty doesn't exist`)
                    }else{
                        questionDB.getCountQuestion(categoryId, (resDBCt)=>{
                            const categoryRows = resDBCt.rows
                            res.status(200).send(categoryRows)
                        })
                    }
                })
            }
        })
    }
})







router.get('/category/count', (req ,res)=>{
    const apiKeyUser = req.headers['api-key']
    let categoryDictionary = {}
    if (!apiKeyUser) {
        return res.status(403).send('Add api-key to headers');
    }else{
        userDB.getUserByApiKey(apiKeyUser, (resDBUser)=>{
            const userApiKey = resDBUser.rows
            if(userApiKey[0] === undefined){
                res.status(403).send('ApiKey is invalid')
            }else{
                categoryDB.getAllCategory((resDBCt)=>{
                    const categoryRows = resDBCt.rows 
                    res.status(200)
                    for (const category of categoryRows){
                        questionDB.getCountQuestion(category.id, (resQ)=>{
                            const categories = resQ.rows
                            const categoryName = category.name;
                            const questionCount = categories[0].count;

                            categoryDictionary[categoryName] = questionCount;

                            if (category === categoryRows[categoryRows.length - 1]) {
                                res.status(200).send(categoryDictionary)
                            }
                        })
                    }
                })
            }   
        })
    }
})





module.exports = router