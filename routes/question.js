const express = require('express')
const router = express.Router()
const apiKeyDB = require('../db/apiKey.js')
const questionDB = require('../db/question.js')
const categoryDB = require('../db/category.js')
const userDB = require('../db/User.js')

const currentDate = new Date();

let day = currentDate.getDate();
let month = currentDate.getMonth() + 1; // Месяцы в JavaScript начинаются с 0
let year = currentDate.getFullYear();

let hours = currentDate.getHours();
let minutes = currentDate.getMinutes();

const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`

router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const category = req.query.category;
    const difficulty = parseInt(req.query.difficulty);

    const apiKeyUser = req.headers['api-key'];

    if (!apiKeyUser) {
        return res.status(403).send('Add api-key to headers');
    }
    userDB.getUserByApiKey(apiKeyUser, (resDBUser)=>{
        const userApiKey = resDBUser.rows
        if(userApiKey[0] === undefined){
            res.status(403).send('api-key is invalid')
        }
    })
    
    if (limit < 1 || limit > 10) {
        return res.status(400).json({ status: 400, message: 'Limit must be between 1 and 10' });
    }

    if (difficulty && (difficulty < 1 || difficulty > 3)) {
        return res.status(400).json({ status: 400, message: 'Difficulty must be between 1 and 3' });
    }

    questionDB.getQuestionsWithParams(limit, category, difficulty, (err, questions) => {
        if (err) {
            res.status(500).json({ status: 500, message: 'Internal Server Error' });
        } else {
            if (questions.length > 0) {
                res.status(200).json(questions);
            } else {
                res.status(404).json({ status: 404, message: 'Question does not exist' });
            }
        }
    });
});

router.get('/:id', (req, res)=>{
    const apiKeyUser = req.headers['api-key'];

    if (!apiKeyUser) {
        return res.status(403).send('Add api-key to headers');
    }
    userDB.getUserByApiKey(apiKeyUser, (resDBUser)=>{
        const userApiKey = resDBUser.rows
        if(userApiKey[0] === undefined){
            res.status(403).send('api-key is invalid')
        }
    })
    
    questionDB.getQuestionsById(req.params.id, (resQ)=>{
        const questionRows = resQ.rows
        if (questionRows){
            res.status(200).send(questionRows)
        } else {
            res.status(404).send('Question does not exist') 
        }
    })
})

router.post('/', (req, res) => {
    const apiKeyUser = req.headers['api-key']

    if(!apiKeyUser){
        res.status(403).send('Add apikey to headers')
    }else{
        userDB.getUserByApiKey(apiKeyUser, (resDBUser)=>{
            const userApiKey = resDBUser.rows
        if(userApiKey[0] === undefined){
            res.status(403).send('api-key is invalid')
        }else{
                const question = req.body.question
                const correctAnswer = req.body.correctAnswer
                const difficulty = req.body.difficulty
                const incorrectAnswer1 = req.body.incorrectanswer1
                const incorrectAnswer2 = req.body.incorrectanswer2
                const incorrectAnswer3 = req.body.incorrectanswer3
                const category = req.body.category
                categoryDB.getCategoryById(category, (resDBCategory)=>{
                    const categoryId = resDBCategory.rows
                    if(categoryId[0] === undefined){
                        res.status(404).send('Category does not exist')
                    }else{
                        if(question == undefined){
                            res.status(400).send('add question')
                        }else if (correctAnswer == undefined){
                            res.status(400).send('add correctAnswer')
                        }else if (difficulty == undefined){
                            res.status(400).send('add difficulty')
                        }else if (incorrectAnswer1 == undefined){
                            res.status(400).send('add incorrectAnswer1')
                        }else if (incorrectAnswer2 == undefined){
                            res.status(400).send('add incorrectAnswer2')
                        }else if (incorrectAnswer3 == undefined){
                            res.status(400).send('add incorrectAnswer3')
                        }else if (category == undefined){
                            res.status(400).send('add category')
                        }else{
                            questionDB.addQuestion(question, correctAnswer, difficulty, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, userApiKey[0].id, category, formattedDate, "none")
                            res.status(201).send('Question created ')
                        }
                    }
                })
            }
        })
    }
})

router.put('/:id', (req, res)=>{
    const apiKeyUser = req.headers['api-key']
    if (!apiKeyUser) {
        return res.status(403).send('Add api-key to headers');
    }
    if (apiKeyUser.length < 1) {
        return res.status(403).send('Apikey is invalid');
    }
    questionDB.getQuestionsById(req.params.id, (resQ)=>{
        const questionRows = resQ.rows
        if (questionRows){
            const question = req.body.question
            const correctAnswer = req.body.correctAnswer
            const difficulty  = req.body.difficulty
            const incorrectanswer1 = req.body.incorrectanswer1
            const incorrectanswer2 = req.body.incorrectanswer2
            const incorrectanswer3 = req.body.incorrectanswer3
            const creator = req.body.creator
            const category = req.body.category
            categoryDB.getCategoryById(category, (resCategory)=>{
                userDB.getUserByApiKey(apiKeyUser, (resUser)=>{
                    const user = resUser.rows
                    const categories = resCategory.rows
                if(question == undefined){
                    res.status(400).send('add question')
                }else if (correctAnswer == undefined){
                    res.status(400).send('add correctAnswer')
                }else if(difficulty == undefined){
                    res.status(400).send('add difficulty')
                }else if (incorrectanswer1 == undefined){
                    res.status(400).send('add incorrectAnswer1')
                }else if(incorrectanswer2 == undefined){
                    res.status(400).send('add incorrectAnswer2')
                }else if (incorrectanswer3 == undefined){
                    res.status(400).send('add incorrectAnswer3')
                }else if(questionRows[0].creator != user[0].id){
                    res.status(400).send('You didn`t have access to this question')
                }else if(category != categories[0].id){
                    res.status(404).send('this category doesn`t exist')
                }else if (category == undefined){
                    res.status(400).send('add category')
                }else{
                    questionDB.updateQuestion(question, correctAnswer, difficulty, incorrectanswer1, incorrectanswer2, incorrectanswer3, category, formattedDate, req.params.id)
                    res.status(200).send(`question with id ${req.params.id} updated`)
                }
            })
        })
        }else{
            res.status(400).send('question doesn`t exist')
            }
})
})



router.delete('/:id', (req, res)=>{
    const apiKeyUser = req.headers['api-key']
    const questionId = req.params.id
    if (!apiKeyUser) {
        return res.status(403).send('Add api-key to headers');
    }else{
        userDB.getUserByApiKey(apiKeyUser, (resDBUser)=>{
            const userApiKey = resDBUser.rows
            if(userApiKey[0] === undefined){
                res.status(403).send('ApiKey is invalid')
            }else{
                questionDB.getQuestionsById(questionId, (resQ)=>{
                    const questionFD = resQ.rows
                    if(questionFD[0] === undefined){
                        res.status(404).send('question does not exist')
                    }else if(userApiKey.id != questionFD.creator){
                        res.status(403).send('You didn`t have access to this question')
                    }else{
                        questionDB.delQuestion(questionId)
                        res.status(204).send('Question deleted')
                    }
                })
            }
        }
    )}
})


module.exports = router;