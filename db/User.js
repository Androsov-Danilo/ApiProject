const client = require('./connect.js');

function createTable() {
    const query = `CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(255),
        userName VARCHAR(255),
        apiKey VARCHAR(25),
        admin BOOLEAN
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
    client.query(query, callback);
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

module.exports = {
    createTable: createTable,
    addUser: addUser,
    getAllUser: getAllUser,
    getUser: getUser,
    delUser: delUser
};