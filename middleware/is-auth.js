const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const auth_header = req.get('Authorization');
    if(!auth_header) {
        req.isAuth = false;
        return next();
    }

    const token = auth_header.split(" ")[1]; //Authorization Bearer "token"
    if(!token || token === ''){
        req.isAuth = false;
        return next();
    } 

    let decoded_token;
    try {
        decoded_token = jwt.verify(token, 'mysecretKey');
    } catch (error) {
        req.isAuth = false;
        return next();
    }

    if(!decoded_token){
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decoded_token.userId;
    next();
}