const express = require('express')
const router = express.Router()
const apiKeyDB = require('../db/apiKey.js')
const questionDB = require('../db/question.js')
const categoryDB = require('../db/category.js')

// router.get('/allq', checkApiKey, checkCategoryExistence, (req, res) => {
//     const limit = parseInt(req.query.limit) || 5;
//     const category = req.query.category;
//     const difficulty = parseInt(req.query.difficulty);

//     if (limit < 1 || limit > 10) {
//         return res.status(400).json({ status: 400, message: 'Limit must be between 1 and 10' });
//     }


//     if (difficulty && (difficulty < 1 || difficulty > 3)) {
//         return res.status(400).json({ status: 400, message: 'Difficulty must be between 1 and 3' });
//     }

//     questionDB.getQuestionsWithParams(limit, category, difficulty, (err, questions) => {
//         if (err) {
//             res.status(500).json({ status: 500, message: 'Internal Server Error' });
//         } else {
//             if (questions.length > 0) {
//                 res.status(200).json(questions);
//             } else {
//                 res.status(404).json({ status: 404, message: 'Question does not exist' });
//             }
//         }
//     });
// });

router.get('/:id', (req, res)=>{
    const apiKeyUser = req.headers['api-key'];

    if (!apiKeyUser) {
        return res.status(403).send('Add api-key to headers');
    }

    if (apiKeyUser.length < 1) {
        return res.status(403).send('Apikey is invalid');
    }
    
    questionDB.getQuestionsById(req.params.id, (req, res)=>{
        const questionRows = res.rows
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
        apiKeyDB.isKey(apiKeyUser, (resDBKey)=>{
            const rowsKey = resDBKey.rows
            if(rowsKey.lenght < 1){
                res.status(403).send('api-key is invalid')
            }else{
                categoryDB.getCategory((resDBCategory) => {
                    const category = resDBCategory.rows
                    console.log(category)
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
    questionDB.getQuestionsById(req.params.id, (req, res)=>{
        const questionRows = res.rows
        if (questionRows){
            const question = req.body.question
            const correctAnswer = req.body.correctAnswer
            const difficulty  = req.body.difficulty
            const incorrectAnswer1 = req.body.incorrectAnswer1
            const incorrectAnswer2 = req.body.incorrectAnswer2
            const incorrectAnswer3 = req.body.incorrectAnswer3
            const creator = req.body.creator
            const category = req.body.category
            const creationDate = req.body.creationDate
            const updateDate = req.updateDate.updateDate
            if(question == undefined){
                res.status(400).send('add question')
            }else if (correctAnswer == undefined){
                res.status(400).send('add correctAnswer')
            }else if(difficulty == undefined){
                res.status(400).send('add difficulty')
            }else if (incorrectAnswer1 == undefined){
                res.status(400).send('add incorrectAnswer1')
            }else if(incorrectAnswer2 == undefined){
                res.status(400).send('add incorrectAnswer2')
            }else if (incorrectAnswer3 == undefined){
                res.status(400).send('add incorrectAnswer3')
            }else if(creator == undefined){
                res.status(400).send('add creator')
            }else if (category == undefined){
                res.status(400).send('add category')
            }else if(creationDate == undefined){
                res.status(400).send('add creationDate')
            }else if (updateDate == undefined){
                res.status(400).send('add updateDate')
            }
        }else{
            res.status(400).send('question doesn`t exist')
                }
})
})

module.exports = router;