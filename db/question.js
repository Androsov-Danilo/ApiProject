const client = require('./connect.js');

function createTable() {
    const query = `CREATE TABLE IF NOT EXISTS Question (
        id SERIAL PRIMARY KEY,
        question varchar(255),
        correctAnswer varchar(255),
        difficulty INTEGER,
        incorrectanswer1 varchar(255),
        incorrectanswer2 varchar(255),
        incorrectanswer3 varchar(255),
        creator INTEGER,
        category INTEGER,
        creationdata varchar(255),
        updatedate varchar(255)
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.error('Error creating Users table:', err);
        } else {
            console.log('Users table created successfully');
        }
    });
}


async function updateQuestion(question, correctAnswer, difficulty, incorrectanswer1, incorrectanswer2, incorrectanswer3, category, updatedate, id) {
    const query = 'UPDATE Question SET question = $1, correctAnswer = $2, difficulty=$3, incorrectanswer1 = $4, incorrectanswer2 = $5, incorrectanswer3 = $6,  category = $7 , updatedate = $8 WHERE id = $9';
    const values = [question, correctAnswer, difficulty, incorrectanswer1, incorrectanswer2, incorrectanswer3, category, updatedate, id];

    try {
        await client.query(query, values);
        console.log(`User updated successfully.`);
    } catch (error) {
        console.error('Error updating user:', error);
    }
}


function addQuestion(question, correctAnswer, difficulty, incorrectanswer1, incorrectanswer2, incorrectanswer3, creator, category, creationdata, updateDate) {
    const query = `
        INSERT INTO Question (question, correctAnswer, difficulty, incorrectanswer1, incorrectanswer2, incorrectanswer3, creator, category, creationdata, updateDate) VALUES('${question}', '${correctAnswer}', ${difficulty}, '${incorrectanswer1}', '${incorrectanswer2}', '${incorrectanswer3}', '${creator}', '${category}', '${creationdata}', '${updateDate}');`
        client.query(query);
    }

function getAllQuestions(callback){
    const query =  `SELECT * FROM Question`
    client.query(query,(err, res) =>{
        callback(res)
    }) 
}

function getQuestionsWithParams(limit, category, difficulty, callback) {
    const baseQuery = 'SELECT * FROM Question WHERE';
    const conditions = [];

    if (category) {
        conditions.push(`category = ${category}`);
    }

    if (difficulty) {
        conditions.push(`difficulty = ${difficulty}`);
    }

    const conditionsString = conditions.length > 0 ? conditions.join(' AND ') : '1 = 1';
    const finalQuery = `${baseQuery} ${conditionsString} ORDER BY RANDOM() LIMIT ${limit}`;

    client.query(finalQuery, (err, res) => {
        if (err) {
            console.error('Error fetching random questions with params:', err);
            callback(err, null);
        } else {
            callback(null, res.rows);
        }
    });
}
function getQuestionsById(id, callback){
    const query = `SELECT * FROM Question WHERE id =${id}`
    client.query(query, (err, res)=>{
        callback(res)
    })
}

function getQuestionByUserId(id, callback){
    const query = `SELECT * FROM Question WHERE creator = ${id}`
    client.query(query, (err, res) =>{
        callback(res)
    })
}


function getCountQuestion(category, callback){
    const query = `SELECT COUNT(question) FROM Question WHERE category = ${category}`
    client.query(query, (err, res) =>{
        callback(res)
    })
}

function delQuestion(id){
    const query = `DELETE FROM Question WHERE id = ${id}`
    client.query(query, (err, res)=>{
        if (err) {
            console.error('Error deleting question:', err);
        } else {
            console.log('question deleted successfully');
        }
    })
}

module.exports ={
    getQuestionsById: getQuestionsById,
    addQuestion: addQuestion,
    updateQuestion: updateQuestion,
    getQuestionsWithParams: getQuestionsWithParams,
    delQuestion: delQuestion,
    getCountQuestion : getCountQuestion,
    getQuestionByUserId: getQuestionByUserId,
    getAllQuestions: getAllQuestions,
}