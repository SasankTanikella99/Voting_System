const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

    // check request headers has authorization
    const authorization = req.headers.authorization
    if (!authorization) return res.status(401).send({ error: 'No token provided.' });


    // Extract the jwt token from request headers
    const token = req.headers.authorization.split("")[1]
    if(!token){
        return res.status(403).json({message: 'Invalid jwt token'})     
    }
    try{
        // verify the jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        //Attach user information to the request object
        req.user = decoded
        next();
    }
    catch(err){
        console.log(err)
        res.status(403).json({message: 'Invalid jwt token'}) 
    }
}

// Function to Generate Token
const generateToken = (userData) => {
    // generate the token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 30})
}

module.exports = {jwtAuthMiddleware, generateToken}