const jwt = require("jsonwebtoken");
const checkEmailVerified = (req, res, next) => {
    const verified = jwt.decode(req.cookies['jwtToken']).verified
    if (verified) {
        console.log('email verified user')
        return next()
    } else {
        console.log('email not verified user')
        return res.status(401).send({message: 'not verified'})
    }
}

module.exports = checkEmailVerified