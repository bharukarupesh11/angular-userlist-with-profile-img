const CryptoJS = require('crypto-js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express'); // returns a function
const router = express.Router(); //returns a router object

const db = require('../models'); // // When require is given the path of a folder, it'll look for an index.js file in that folder, if there is one, it uses that, otherwise it fails.
const User = db.user; 


// Open API - Route to authenticate login user
router.post('/', async (req, res) => {
    try {
        let user = await User.findOne({where: {email: req.body.email}});
        
        if(!user.isAdmin) return res.status(403).send({errorMsg: 'Access denied.'});
        if(!user) return res.status(400).send({errorMsg: `Invalid mobile no or password.`}); // 400 - Bad Request
        
        // decrypting UI Password using CryptoJS. Provided secret key same that is used on ui for the encryption.
        const decryptedPass = CryptoJS.AES.decrypt(req.body.password, 'USER_APP').toString(CryptoJS.enc.Utf8);
        
        // validate password
        const validPassword = await bcrypt.compare(decryptedPass, user.password); // returns true if password matches
        if(!validPassword) return res.status(400).send({errorMsg: `Invalid mobile no or password.`}); // 400 - Bad Request
        
        const token = jwt.sign({userId: user.userId}, 'jwtPrivateKey'); // payload, private key, options(expiration time)
        
        user = {
            "userId": user.userId,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "isAdmin": user.isAdmin,
            "token": token
        }
        
        res.status(200).send(user);   
    } catch(err) {
        console.log('Inside login user catch block');
        // res.status(500).send(err);
        return res.send({errorMsg: err});
    }
});

module.exports = router;