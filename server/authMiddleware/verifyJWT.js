const jwt = require("jsonwebtoken");
const verifyJWT = (req, res, next) => {
    const token = req.cookies['jwtToken']
    if (!token) {
        console.log('no token')
        return res.status(401).send({message: 'no token found'})
    }
    try {
        req.ecr14user = jwt.verify(token, process.env.JWT_SECRET)
        req.ecr14user.houseBlock = req.ecr14user.houseNo.charAt(0).toUpperCase()
        console.log('user ' + req.ecr14user.houseNo)
    } catch (e) {
        console.log('error' + e)
        return res.status(401).send({message: 'invalid token', e})
    }
    console.log('jwt verified')
    return next()
}

module.exports = verifyJWT