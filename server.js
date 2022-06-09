const express = require('express')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const model = require('./server/model/model')
const sendEmail = require('./server/utils/sendEmail')
const crypto = require('crypto')
const cors = require('cors')
const app = express()
const nocache = require('nocache')
require('dotenv').config()
app.use(cors({origin: '*'}))
app.use(nocache())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const dbConn = require('./server/connection/connection')
const {nomineeModel, surveyModel, pollModel} = require("./server/model/model");
const {register, verifyEmail, login, registered, resetPassword, verifyReset} = require("./server/controllers/user");

dbConn()
// const path = require("path")
// app.use(express.static(path.join(__dirname, 'client', 'build')))
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
// })

app.listen(process.env.PORT, () => {
    console.log(`server on ${process.env.PORT}`)
})

app.post('/api/register', register)

app.get('/api/:id/verify/:token', verifyEmail)

app.post('/api/resetPassword', resetPassword)

app.post('/api/:id/reset/:token', verifyReset)

app.get('/api/registered', registered)

app.post('/api/login', login)

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        console.log('no token')
        return res.status(401).send({message: 'no token found'})
    }
    try {
        // console.log(token)
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        console.log('error ' + e)
        return res.status(401).send({message: 'invalid token', e})
    }
    return next()
}

const checkVerified = (req, res, next) => {
    const verified = jwt.decode(req.headers['authorization']).verified
    if (verified) {
        console.log('verified')
        return next()
    } else {
        console.log('not verified')
        return res.status(401).send({message: 'not verified'})
    }
}

app.get('/api/verifyEmail', verifyToken, async (req, res) => {

    const jwtToken = req.headers['authorization']

    try {
        const houseNo = jwt.verify(jwtToken, process.env.JWT_SECRET).houseNo
        try {
            const user = await model.userModel.findOne({houseNo: houseNo}, {password: 0})
            console.log(user)
            console.log(user.verified)
            if (!user.verified) {
                let token = await model.tokenModel.findOne({userId: user._id})
                if (token) {
                    await token.remove()
                }

                token = await new model.tokenModel({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex")
                }).save()
                const url = `${process.env.CLIENT_URL}/verify/${user._id}/verify/${token.token}`
                await sendEmail(user.email, 'verify email', url)
                res.status(200).send({message: 'email sent'})

            } else {
                return res.status(400).send({message: 'already verified'})
            }

        } catch (e) {
            console.log(e)
            res.status(500).send({error: e})
        }
    } catch (e) {
        res.status(401).send({message: 'jwt token invalid'})
    }

})

app.get('/api/getUser', verifyToken, async (req, res) => {

    const token = req.headers['authorization']
    try {

        const houseNo = jwt.verify(token, process.env.JWT_SECRET).houseNo
        try {
            const user = await model.userModel.findOne({houseNo: houseNo}, {password: 0})
            if (user) {
                res.status(200).send(user)
            } else {
                res.status(401).send({message: 'empty user'})
            }
        } catch (e) {
            console.log(e)
            res.status(401).send({e})
        }
    } catch (e) {
        res.status(401).send(e)
    }


})

app.post('/api/addPoll', verifyToken, async (req, res) => {
    const _id = jwt.decode(req.headers['authorization'])._id
    const isAdmin = jwt.decode(req.headers['authorization']).isAdmin
    if (!isAdmin) {
        res.status(401).send({message: 'not admin'})
        return
    }
    const poll = new model.pollModel({
        createdBy: _id,
        position: req.body.position,
        forBlock: req.body.forBlock,
        representatives: req.body.representatives
    })

    try {
        const savedPoll = await poll.save()
        res.status(200).send(savedPoll)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

app.get('/api/getPolls', verifyToken, async (req, res) => {
    const _id = jwt.decode(req.headers['authorization'])._id
    const isAdmin = jwt.decode(req.headers['authorization']).isAdmin
    const block = jwt.decode(req.headers['authorization']).houseNo.charAt(0).toUpperCase()
    const polls = await pollModel.find()
    const userPolls = []
    for (let poll of polls) {
        if (poll.forBlock === block) {
            userPolls.push(poll)
        }
    }
    try {
        if (isAdmin) {

            return res.status(200).send({polls, userPolls})
        } else {
            const userPolls = []
            // for (let poll of polls) {
            //     if (poll.forBlock === block) {
            //         userPolls.push(poll)
            //     }
            // }
            return res.status(200).send({userPolls})
        }
    } catch (e) {
        // console.log(e)
        res.status(500).send({e})
    }

})

app.post('/api/addNominee', verifyToken, async (req, res) => {
    const nominee = new model.nomineeModel({
        name: req.body.name,
        houseNo: req.body.houseNo,
        description: req.body.description,
        poll: req.body.pollId
    })

    try {
        await nominee.save()
        res.status(200).send({message: 'nominee saved'})
    } catch (e) {
        res.status(500).send({message: 'nominee not saved', e})
    }
})

app.get('/api/getNominees', verifyToken, async (req, res) => {
    const block = jwt.decode(req.headers['authorization']).houseNo.charAt(0)
    const isAdmin = jwt.decode(req.headers['authorization']).isAdmin
    try {
        const nominees = await model.nomineeModel.find().populate('poll')
        const userNominees = nominees.filter((n) => n.poll.forBlock === block)
        if (isAdmin) {
            // console.log(nominees)
            res.status(200).send({userNominees, nominees})
        } else {
            // console.log(userNominees)
            res.status(200).send({userNominees})
        }
    } catch (e) {
        res.status(500).send({e})
    }
})

app.post('/api/vote', verifyToken, async (req, res) => {
    const houseNo = jwt.decode(req.headers['authorization']).houseNo
    const nomineeIds = req.body.nomineeIds
    console.log(req.body)
    try {

        const nominee = await nomineeModel.findOne({_id: nomineeIds[0]}).populate('poll').exec()

        // console.log(nomineeIds)

        if (nomineeIds.length !== nominee.poll.representatives) {
            res.status(400).send({message: `sent reps ${nomineeIds.length} and required reps ${nominee.poll.representatives} do not match`})
            return
        }

        for (let nominee of nomineeIds) {
            await nomineeModel.updateOne({_id: nominee},{ $addToSet: {voters: houseNo}})
            console.log(await nomineeModel.findOne({_id: nominee}).populate('poll').exec())
        }

        await model.nomineeModel.aggregate([
            { $addFields: {votes: {$size: "$voters"}}},
            { $out: "nominees"}
        ])
        res.status(200).send({message: 'vote increased'})
    } catch (e) {
        console.log(e)
        res.status(500).send({message: e})
    }
})

app.get('/api/getVotes', verifyToken, async (req, res) => {
    try {
        const result = await nomineeModel.find({$project: { voters: 1, votes: 1 }})
        res.status(200).send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send({message: 'could not get votes', e})
    }
})

app.post('/api/survey', verifyToken, checkVerified, async (req, res) => {

    try {
        const survey = new surveyModel({
            surveyName: 'survey1',
            houseNo: jwt.decode(req.headers['authorization']).houseNo,
            responses: req.body.responses,
        })
        await survey.save()
        res.status(200).send({message: 'saved'})
    } catch (e) {
        console.log(e.code + 'not saved')
        if (e.code === 11000) {
            return res.status(403).send({message: 'already submitted'})
        }
        res.status(500).send({message: 'not saved'})

    }

})

app.get('/api/surveyDetails', verifyToken, async (req, res) => {


    try {
        const yes = await surveyModel.find({response: 'Yes'})
        const no = await surveyModel.find({response: 'No'})
        const notSure = await surveyModel.find({response: 'Not Sure'})
        console.log('yes ' + yes)
        console.log('no ' + no)
        console.log('notSure ' + notSure)
        res.status(200).send({yes, no, notSure})
    } catch (e) {
        res.status(500).send(e)
    }
})