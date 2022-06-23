const express = require('express')
const verifyToken = require("../authMiddleware/verifyToken");
const {updateUser, sendVerificationEmail, getUser} = require("../controllers/profile");
const profileRouter = express.Router()

profileRouter.post('/api/update', verifyToken, updateUser)

profileRouter.get('/api/verifyEmail', verifyToken, sendVerificationEmail)

profileRouter.get('/api/getUser', verifyToken, getUser)

module.exports = profileRouter