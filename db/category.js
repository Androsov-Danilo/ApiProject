const client = require('./connect.js');

function createTable(){
    const query = `CREATE TABLE Category(
        id SERIAL PRIMARY KEY,
        name varchar(255)
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.error('Error creating Category table:', err);
        } else {
            console.log('Category table created successfully');
        }
    });
}

function addCategory(name){
    const query = `INSERT INTO Category(name) VALUES('${name}');`
    client.query(query);
}

function getCategoryById(id, callback){
    const query = `SELECT * FROM Category WHERE id = ${id}`;
    client.query(query, (err, res) =>{
        callback(res)
    });
}


function getCountCategory(callback){
    const query = `SELECT COUNT(id) FROM Category`
    client.query(query, (err, res) =>{
        callback(res)
    })
}

function getAllCategory(callback){
    const query = `SELECT * FROM Category`;
    client.query(query, (err, res) =>{
        callback(res)
    })
}

function checkCategoryExistence(req, res, next) {
    const categoryId = req.query.category;

    if (categoryId) {
        categoryDB.getCategoryById(categoryId, (resDBCategory) => {
            const categoryRows = resDBCategory.rows;

            if (categoryRows.length < 1) {
                return res.status(404).json({ status: 404, message: 'Category does not exist' });
            }

            next(); 
        });
    } else {
        next(); 
    }
}



function delCategory(id) {
    const query = `DELETE FROM Category WHERE id = ${id}`;
    client.query(query, (err, res) => {
        if (err) {
            console.error('Error deleting category:', err);
        } else {
            console.log('category deleted successfully');
        }
    });
}

async function updateCategory(name, id){
    const query = `UPDATE category SET name =$1 WHERE id = $2`
    const values = [name, id];


    try {
        await client.query(query, values);
        console.log(`User with ID ${id} updated successfully.`);
    } catch (error) {
        console.error('Error updating category:', error);
    }

}

module.exports = {
    addCategory: addCategory,
    getCategoryById: getCategoryById,
    checkCategoryExistence: checkCategoryExistence,
    delCategory: delCategory,
    getCountCategory: getCountCategory,
    updateCategory: updateCategory,
    getAllCategory: getAllCategory,
};