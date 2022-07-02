const express = require('express')
const verifyJWT = require("../authMiddleware/verifyJWT");
const {updateUser, sendVerificationEmail, getUser} = require("../controllers/profile");
const profileRouter = express.Router()

profileRouter.post('/api/update', verifyJWT, updateUser)

profileRouter.get('/api/verifyEmail', verifyJWT, sendVerificationEmail)

profileRouter.get('/api/getUser', verifyJWT, getUser)

module.exports = profileRouter