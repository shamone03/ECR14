const express = require('express')
const verifyToken = require("../authMiddleware/verifyToken");
const checkEmailVerified = require("../authMiddleware/checkEmailVerified");
const {addPoll, getPolls, addNominee, getNominees, voteNominee, getVotes} = require("../controllers/vote");

const router = express.Router()

router.post('/api/addPoll', verifyToken, checkEmailVerified, addPoll)

router.get('/api/getPolls', verifyToken, getPolls)

router.post('/api/addNominee', verifyToken, checkEmailVerified, addNominee)

router.get('/api/getNominees', verifyToken, getNominees)

router.post('/api/vote', verifyToken, checkEmailVerified, voteNominee)

router.get('/api/getVotes', verifyToken, checkEmailVerified, getVotes)

module.exports = router

