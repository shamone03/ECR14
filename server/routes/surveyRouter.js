const express = require('express')

const verifyToken = require("../authMiddleware/verifyToken");
const checkEmailVerified = require("../authMiddleware/checkEmailVerified");
const {postSurvey, getSurveyDetails} = require("../controllers/survey");
const router = express.Router()

router.post('/api/survey', verifyToken, checkEmailVerified, postSurvey)

router.get('/api/surveyDetails', verifyToken, getSurveyDetails)

module.exports = router