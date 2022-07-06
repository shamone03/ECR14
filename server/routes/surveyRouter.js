const express = require('express')

const verifyJWT = require("../authMiddleware/verifyJWT");
const checkEmailVerified = require("../authMiddleware/checkEmailVerified");
const {postSurvey, getSurveyDetails} = require("../controllers/survey");
const router = express.Router()

router.post('/api/survey', verifyJWT, checkEmailVerified, postSurvey)

router.get('/api/surveyDetails', verifyJWT, getSurveyDetails)

module.exports = router