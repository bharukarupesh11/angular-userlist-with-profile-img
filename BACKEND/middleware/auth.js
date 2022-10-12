const jwt = require('jsonwebtoken');
// const config = require('config');

module.exports = function auth(req, res, next) {
    const token = req.header('x-auth-token');
    
    if(!token) return res.status(401).send({errorMsg: 'Access denied. No token provided.'});

    try{
        // const decoded = jwt.verify(token, config.get('jwtPrivateKey'), {expiresIn: 3600});
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        console.log('Decoded Value : ', decoded);
        req.user = decoded;
        next(); // pass control to the next middleware function
    }catch(ex){
        res.status(400).send({errorMsg: 'Invalid token.'});
    }   
}