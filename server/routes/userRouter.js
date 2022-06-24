const express = require('express')
const {register, verifyEmailLink, resetPassword, verifyReset, registered, login, logout} = require("../controllers/loginRegister");

const userRouter = express.Router()

userRouter.post('/api/register', register)

userRouter.get('/api/:id/verify/:token', verifyEmailLink)

userRouter.post('/api/resetPassword', resetPassword)

userRouter.post('/api/:id/reset/:token', verifyReset)

userRouter.get('/api/registered', registered)

userRouter.post('/api/login', login)

userRouter.get('/api/logout', logout)

module.exports = userRouter