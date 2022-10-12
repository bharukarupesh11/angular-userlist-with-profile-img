const path = require('path');
const fs = require('fs');
const db = {};

const Sequelize = require('sequelize');   // testing database connection 

/** Testing database connection starts here
 * public constructor(database: string, username: string, password: string, options: object)
 */
 const sequelize = new Sequelize('user_app', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        underscored: true, // use underscore in table name if multiple names are given like customer_details
    }
});

const basename = path.basename(__filename); // returns index.js as a basename of a file
const fileNames = fs.readdirSync(__dirname); // returns an array of file names as ['index.js', 'user.js']

//console.log('Dir Name: ', __dirname); // gives us path of models folder : C:\Users\DELL-PC\Desktop\consagous_task\backend\models

fileNames
    .filter(file => (file.indexOf('.') !== 0 ) && (file !== basename) && (file.slice(-3) === '.js')) // filter method returns an array of filtered data based on the condition in it
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize); // calling a function of respected files on the given path
        db[model.name] = model;
    });


db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;


