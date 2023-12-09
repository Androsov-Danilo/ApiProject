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

function getCategory(callback){
    const query = `SELECT * FROM Category`;
    client.query(query, (err, res) =>{
        callback(res)
    });
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
module.exports = {
    addCategory: addCategory,
    getCategory: getCategory,
    getCategory: checkCategoryExistence
};