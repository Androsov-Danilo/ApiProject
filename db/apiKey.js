const client = require('./connect.js');
const { v4: uuidv4 } = require('uuid');

function createApiTable() {
    const query = `CREATE TABLE IF NOT EXISTS ApiKey (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255),
        countRequests INT
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.error('Error creating ApiKey table:', err);
        } else {
            console.log('ApiKey table created successfully');
        }
    });
}

function addApiKey() {
    const countRequests = 25;
    const apiKey = uuidv4();
    const query = `INSERT INTO ApiKey(key, countRequests) VALUES ('${apiKey}', '${countRequests}')`;
    client.query(query, (err, res) => {
        if (err) {
            console.error('Error adding ApiKey:', err);
        } else {
            console.log('ApiKey added successfully');
        }
    });
    return apiKey;
}

function isKey(apiKey, callback) {
    const query = `SELECT * FROM ApiKey WHERE key = '${apiKey}'`;
    client.query(query, (err, res) => {
        callback(err, res);
    });
}

module.exports = {
    addApiKey: addApiKey,
    isKey: isKey,
    createApiTable: createApiTable
};