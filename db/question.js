const client = require('./connect.js');

function createTable() {
    const query = `CREATE TABLE IF NOT EXISTS Question (
        id SERIAL PRIMARY KEY,
        question varchar(255),
        correctAnswer varchar(255),
        difficulty INTEGER,
        incorrectAnswer1 varchar(255),
        incorrectAnswer2 varchar(255),
        incorrectAnswer3 varchar(255),
        creator INTEGER,
        category varchar(255),
        creationDate varchar(255),
        updateDate varchar(255)
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.error('Error creating Users table:', err);
        } else {
            console.log('Users table created successfully');
        }
    });
}

function addQuestion(question, correctAnswer, difficulty, incorrectAnswers1, incorrectAnswers2, incorrectAnswers3, creator, category, creationDate, updateDate) {
    const query = `
        INSERT INTO Question (question, correctAnswer, difficulty, incorrectAnswers1, incorrectAnswers2, incorrectAnswers3, creator, category, creationDate, updateDate) VALUES('${question}', '${correctAnswer}', ${difficulty}, '${incorrectAnswers1}', '${incorrectAnswers2}', '${incorrectAnswers3}', '${creator}', '${category}', '${creationDate}', '${updateDate}');`
        client.query(query);
    }

function getAllQuestions(callback){
    const query =  `SELECT * FROM Question`
    client.query(query,(err, res) =>{
        if (err){
            console.error('Error fetching questions:', err);
            callback(err, null);
        }
        else{
            callback(null, result.rows);
        }
    }) 
}

function getQuestionById(id, callback){
    const query = `SELECT question FROM Question WHERE id =${id}`
    client.query(query, (err, res)=>{
        callback(res)
    })
}

module.exports ={
    getQuestionById: getQuestionById,

}