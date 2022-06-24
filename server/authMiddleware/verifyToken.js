const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    const token = req.cookies['jwtToken']
    if (!token) {
        console.log('no token')
        return res.status(401).send({message: 'no token found'})
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        console.log('error ' + e)
        return res.status(401).send({message: 'invalid token', e})
    }
    console.log('jwt verified')
    return next()
}

module.exports = verifyToken