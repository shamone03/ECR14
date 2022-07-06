const express = require('express')
const verifyJWT = require("../authMiddleware/verifyJWT");
const checkEmailVerified = require("../authMiddleware/checkEmailVerified");
const {addPoll, getPolls, addNominee, getNominees, voteNominee, getVotes} = require("../controllers/vote");

const router = express.Router()

router.post('/api/addPoll', verifyJWT, checkEmailVerified, addPoll)

router.get('/api/getPolls', verifyJWT, getPolls)

router.post('/api/addNominee', verifyJWT, checkEmailVerified, addNominee)

router.get('/api/getNominees', verifyJWT, getNominees)

router.post('/api/vote', verifyJWT, checkEmailVerified, voteNominee)

router.get('/api/getVotes', verifyJWT, checkEmailVerified, getVotes)

module.exports = router

