const fs = require('fs');
const path = require('path');
const url = require('url');
const express = require('express'); // returns a function
const router = express.Router(); //returns a router object
const multer = require('multer');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth'); // here auth represents authorization but not the authentication


const db = require('../models'); // // When require is given the path of a folder, it'll look for an index.js file in that folder, if there is one, it uses that, otherwise it fails.
const User = db.user; 

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
        // callback(null, ` ${Date.now()}_ ${file.originalname}`)
        callback(null, ` ${file.originalname}`)
    }
  })

const upload = multer({storage: storage});

// API restricted with authentication. Only admin user can see the list of all users in the system.
router.get('/', auth, async (req, res) => {
    try {
        console.log('Inside get users route');
        const user = await User.findByPk(req.user.userId);
        if(!user.isAdmin) return res.status(403).send({errorMsg: 'Access denied.'});
        
        const pageNumber = Number.parseInt(req.query.page);
        const sizeNumber = Number.parseInt(req.query.size);  

        let page = 0;
        if(!Number.isNaN(pageNumber) && pageNumber > 0) {
            page = pageNumber - 1; // because in database offset index start from 0(zero). So, if user want to see 1st page records then we need to set offset to 0
        }

        let size = 5;
        if(!Number.isNaN(sizeNumber) && sizeNumber > 0 && sizeNumber < 10) {
            size = sizeNumber;
        }

        const users = await User.findAndCountAll({
            limit: parseInt(size),  // limit returns only the no of records that we've mentioned in the limit parameter. So, we will get only 5 records all the time in the resultset.
            offset: parseInt(page * size)  // This is the starting point of the resultset
        }); // returns count of total records along with the resultset

        return res.status(200).send({
            totalRecords: users.count,
            totalPages: Math.ceil(users.count / size),
            records: users.rows
        });
    } catch (err) {
        console.log('Error Occurred in get users api: ', err);
        return res.send({errorMsg: err.errors[0].message})
    }
});


router.get('/:userId', auth,   async (req, res, next) => {
    try{
        const user = await User.findByPk(req.params.userId);
        
        return res.send(user);
    } catch(ex) {
        console.log('inside user get by id catch block: ', ex);
        return res.send({errorMsg: err.errors[0].message})
    }
});

router.get('/userprofile/:name', async (req, res, next) => {
    // const folderPath = 'C:\\Users\\DELL-PC\\Desktop\\consagous_task\\backend\\uploads\\';
    const folderPath = 'E:\\Mosh\\mosh-angular-examples\\consagous_task\\backend\\uploads\\';
    const fname = path.parse(req.params.name).name;
    const extname = path.extname(req.params.name);

    fs.readdirSync(folderPath).forEach(file => {
        const filename = path.parse(file).name;
        const ext = path.extname(file);
        
        if(filename.trim() === fname.trim() && ext.trim() === extname.trim()) {
            return res.sendFile(folderPath +file);
        }
    });
    
});


// signup is an open api because any user can sign up to the system from login page
router.post('/signup', upload.single('file'), async (req, res) => {
    try {
        // only admin user is allowed to create new user in the system
        // let user = await User.findByPk(req.user.userId);
        // if(!user.isAdmin) return res.status(403).send('Access denied.');

        user = await User.findOne({where: {email: req.body.email}});
        if(user) return res.status(409).send({errorMsg: `The user with email "${req.body.email}" already exists!`}); // 409 - Resource already exists

        const file = req.file;
        if(!file) return res.status(400).send({errorMsg: 'Missing a profile image...!'});

        const salt = await bcrypt.genSalt(10); // generating salt
        req.body.password = await bcrypt.hash(req.body.password, salt); // encrypting password

        user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            file: file.originalname,
            isAdmin: req.body.isAdmin
        });

        return res.status(200).send({successMsg: 'User created successfully'});
    } catch(err) {
        console.log('Error occurred in create user api: ', err.errors[0].message);
        // res.send(err);  // sending the entire error object
        return res.send({errorMsg: err.errors[0].message})
    }
});


router.put('/:id', auth, upload.single('file'), async (req, res) => {
    try {
        // Only admin is allowed to register new user in the system
        let user = await User.findByPk(req.user.userId);
        if(!user.isAdmin) return res.status(403).send({errorMsg: 'Access denied.'});
        
        // get the user from the db
        user = await User.findOne({where: {userId: req.params.id}});
        if(!user) return res.status(404).send({errorMsg: `The user does not exists.`});
        
        // Check if any user already exists with the new email id
        let existingUser = await User.findOne({where: {email: req.body.email}});
        if(existingUser && (user.userId !== existingUser.userId)) return res.status(409).send({errorMsg: `The user with email "${req.body.email}" already exists!`}); // 409 - Resource already exists

        const file = req.file;
        if(!file) return res.status(400).send({errorMsg: 'Missing a profile image...!'});
        
        // adding file name to file property of model class and database table
        req.body.file = file.originalname;
        
        let temp = user.userId;
        let rowsUpdated = await User.update(req.body, {where: {userId: req.params.id}});
        
        user = req.body;
        user.userId = temp;

        // user = {
        //     userId: user.userId,
        //     totalRowsUpdated: rowsUpdated[0]
        // }

        return res.status(200).send(user);
    } catch(err) {
        console.log('Inside update user catch block', err);
        return res.status(500).send(err);
    }
});


// delete user api
router.delete('/:id', auth, async (req, res) => {
    try {
        // Only admin is allowed to register new user in the system
        let user = await User.findByPk(req.user.userId);
        if(!user.isAdmin) return res.status(403).send({errorMsg: 'Access denied.'});
        
        // get the user from the db
        user = await User.findOne({where: {userId: req.params.id}});
        if(!user) return res.status(404).send({errorMsg: `The user does not exists.`});
        
        let rowsDeleted = await User.destroy({
            where:{userId: req.params.id}, 
            limit: 1
        });

        user = {
            userId: req.params.id,
            totalRowsDeleted: rowsDeleted
        }

        return res.status(200).send(user);
    } catch(err) {
        console.log('Inside update user catch block', err);
        return res.status(500).send(err);
    }
});



module.exports = router; //exporting a router