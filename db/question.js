const client = require('./connect.js');

function createTable() {
    const query = `CREATE TABLE IF NOT EXISTS Question (
        id SERIAL PRIMARY KEY,
        question TEXT,
        correctAnswer TEXT,
        difficulty INTEGER,
        incorrectAnswers TEXT[],
        category INTEGER
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.error('Error creating Users table:', err);
        } else {
            console.log('Users table created successfully');
        }
    });
}

function addQuestion(question, correctAnswer, difficulty, incorrectAnswers, category) {
    const query = `
        INSERT INTO Question (question, correctAnswer, difficulty, incorrectAnswers, category)
        VALUES ($1, $2, $3, $4, $5)
    `;

    const values = [question, correctAnswer, difficulty, incorrectAnswers, category]}