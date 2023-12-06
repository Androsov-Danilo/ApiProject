const client = require('./connect.js');

function createTable() {
    const query = `CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(255),
        userName VARCHAR(255),
        apiKey VARCHAR(25),
        admin boolean
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.error('Error creating Users table:', err);
        } else {
            console.log('Users table created successfully');
        }
    });
}

function addUser(firstName, userName, admin, apiKey) {
    const query =  `INSERT INTO Users(firstName, userName, admin, apiKey)  VALUES('${firstName}', '${userName}', ${admin}, '${apiKey}');`
    client.query(query);
}

function getAllUser(callback) {
    const query = `SELECT * FROM Users`;
    client.query(query, (err, res) =>{
        callback(res)
    });
}

function getUser(id, callback) {
    const query = `SELECT * FROM Users WHERE id = ${id}`;
    client.query(query, (err, res) =>{
        callback(res)
    });
}
function getUserByApiKey(apiKey, callback) {
    const query = `SELECT * FROM Users WHERE apiKey = '${apiKey}'`
    client.query(query, (err, res)=>{
        callback(res)
    });
}

function verifyUser(apiKey, callback){
    const query = `SELECT admin FROM Users WHERE apiKey  = ${apiKey}`;
    client.query(query, (err, res)=>{
        callback(res)
    });
}

function delUser(id) {
    const query = `DELETE FROM Users WHERE id = ${id}`;
    client.query(query, (err, res) => {
        if (err) {
            console.error('Error deleting user:', err);
        } else {
            console.log('User deleted successfully');
        }
    });
}

async function updateUserById(id, firstName, userName, admin) {
    const query = 'UPDATE Users SET firstName = $1, userName = $2, admin = $3 WHERE id = $4';
    const values = [firstName, userName, admin, id];

    try {
        await client.query(query, values);
        console.log(`User with ID ${id} updated successfully.`);
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

async function updateUserByApiKey(apiKey, firstName, userName) {
    const query = 'UPDATE Users SET firstName = $1, userName = $2 WHERE apiKey = $3';
    const values = [firstName, userName,apiKey];

    try {
        await client.query(query, values);
        console.log(`User updated successfully.`);
    } catch (error) {
        console.error('Error updating user:', error);
    }
}
module.exports = {
    createTable: createTable,
    addUser: addUser,
    getAllUser: getAllUser,
    getUser: getUser,
    delUser: delUser,
    verifyUser: verifyUser,
    updateUserById: updateUserById,
    getUserByApiKey:getUserByApiKey,
    updateUserByApiKey: updateUserByApiKey
};