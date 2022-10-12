const express = require('express');
const db = require('./models');

const PORT = 3000;
const app = express();
require('./startup/routes')(app); // check if it works or not


/** Syncs your models to the database by creating the appropriate tables */
db.sequelize
    .sync()
    .then(() => {
        console.log('Models Synced with database...!');

        app.listen(PORT,  () => console.log(`Server listening on port ${PORT}`));
    })
    .catch(err => console.log(err));


