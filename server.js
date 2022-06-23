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
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended: true, limit: '50mb'}))
const dbConn = require('./server/connection/connection')
const {nomineeModel, surveyModel, pollModel, userModel} = require("./server/model/model");
const {register, verifyEmail, login, registered, resetPassword, verifyReset} = require("./server/controllers/user");
const {Storage} = require('@google-cloud/storage')
const stream = require('stream')


const path = require("path")
app.use(express.static(path.join(__dirname, 'client', 'build')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

dbConn()

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
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        console.log('error ' + e)
        return res.status(401).send({message: 'invalid token', e})
    }
    console.log('jwt verified')
    return next()
}

const checkVerified = (req, res, next) => {
    const verified = jwt.decode(req.headers['authorization']).verified
    if (verified) {
        console.log('email verified user')
        return next()
    } else {
        console.log('email not verified user')
        return res.status(401).send({message: 'not verified'})
    }
}

app.post('/api/update', verifyToken, async (req, res) => {
    if (!req.body) {
        res.status(400).send({message: 'no body'})
    }
    const id = jwt.decode(req.headers['authorization'])._id
    try {
        const user = await userModel.updateOne({_id: id}, {names: req.body.names, number: req.body.number, parkingNos: req.body.parkingNos})
        console.log('user document updated')
        if (req.body.imgBase64.length > 0) {
            const storage = new Storage()
            const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET)
            const bufferStream = new stream.PassThrough()
            bufferStream.end(req.body.imgBase64, 'base64')
            const cloudFile = bucket.file(`${id}.webp`)
            bufferStream.pipe(cloudFile.createWriteStream({
                metadata: {
                    cacheControl: "no-store"
                }
            })).on('error', (e) => {
                console.log('error pic uploading')
                return res.status(500).send({e})
            }).on('finish', async () => {
                console.log('pic uploaded')
                try {
                    await userModel.findOneAndUpdate({_id: id}, {imgURL: `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/${id}.webp`})
                    console.log('imgURL updated')
                } catch (e) {
                    console.log('error updating img url')
                    console.log(e)
                    return res.status(500).send({message: 'error updating img url', e})
                }
            })
        }

        return res.status(200).send()
    } catch (e) {
        console.log(e)
        res.status(500).send({e})
    }
})

app.get('/api/verifyEmail', verifyToken, async (req, res) => {

    const houseNo = jwt.decode(req.headers['authorization']).houseNo

    try {
        const user = await model.userModel.findOne({houseNo: houseNo}, {verified: 1, email: 1, _id: 1})
        if (!user.verified) {
            let token = await model.tokenModel.findOne({userId: user._id})
            if (token) {
                await token.remove()
                console.log('existing token removed')
            }
            token = await new model.tokenModel({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex")
            }).save()
            const url = `${process.env.CLIENT_URL}/verify/${user._id}/verify/${token.token}`
            await sendEmail(user.email, `Verification Email for ${houseNo}`, `Click this link to verify your email(expires in 5 minutes):${url}`)
            res.status(200).send({message: 'email sent'})
        } else {
            console.log('already verified')
            return res.status(400).send({message: 'already verified'})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({error: e})
    }


})

app.get('/api/getUser', verifyToken, async (req, res) => {

    const token = req.headers['authorization']
    try {

        const houseNo = jwt.verify(token, process.env.JWT_SECRET).houseNo
        try {
            const user = await model.userModel.findOne({houseNo: houseNo}, {password: 0})
            if (user) {
                console.log('user found')
                res.status(200).send(user)
            } else {
                console.log('user not found')
                res.status(401).send({message: 'empty user'})
            }
        } catch (e) {
            console.log(e)
            res.status(401).send({e})
        }
    } catch (e) {
        console.log(e)
        res.status(401).send({e})
    }


})

app.post('/api/addPoll', verifyToken, checkVerified, async (req, res) => {
    const _id = jwt.decode(req.headers['authorization'])._id
    const isAdmin = jwt.decode(req.headers['authorization']).isAdmin
    if (!isAdmin) {
        console.log('not admin')
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
        console.log('poll saved')
        res.status(200).send(savedPoll)
    } catch (e) {
        console.log('poll not saved')
        console.log(e)
        res.status(500).send(e)
    }
})

app.get('/api/getPolls', verifyToken, async (req, res) => {
    const isAdmin = jwt.decode(req.headers['authorization']).isAdmin
    const block = jwt.decode(req.headers['authorization']).houseNo.charAt(0).toUpperCase()
    try {
        const polls = await pollModel.find()
        console.log('polls found')
        const userPolls = []
        for (let poll of polls) {
            if (poll.forBlock === block) {
                userPolls.push(poll)
            }
        }
        if (isAdmin) {
            console.log('isAdmin polls and userPolls sent')
            return res.status(200).send({polls, userPolls})
        } else {
            console.log('userPolls sent')
            return res.status(200).send({userPolls})
        }
    } catch (e) {
        console.log('polls not found')
        console.log(e)
        return res.status(404).send({e})
    }

})

app.post('/api/addNominee', verifyToken, checkVerified, async (req, res) => {
    const nominee = new model.nomineeModel({
        name: req.body.name,
        houseNo: req.body.houseNo,
        description: req.body.description,
        poll: req.body.pollId
    })

    try {
        await nominee.save()
        console.log('nominee saved')
        res.status(200).send({message: 'nominee saved'})
    } catch (e) {
        console.log('nominee not saved')
        console.log(e)
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
            console.log('isAdmin userNominees nominees sent')
            res.status(200).send({userNominees, nominees})
        } else {
            console.log('userNominees sent')
            res.status(200).send({userNominees})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({e})
    }
})

app.post('/api/vote', verifyToken, checkVerified, async (req, res) => {
    const houseNo = jwt.decode(req.headers['authorization']).houseNo
    const nomineeIds = req.body.nomineeIds

    try {

        const nominee = await nomineeModel.findOne({_id: nomineeIds[0]}).populate('poll').exec()

        if (nomineeIds.length !== nominee.poll.representatives) {
            console.log(`sent reps ${nomineeIds.length} and required reps ${nominee.poll.representatives} do not match`)
            res.status(400).send({message: `sent reps ${nomineeIds.length} and required reps ${nominee.poll.representatives} do not match`})
            return
        }

        for (let nominee of nomineeIds) {
            await nomineeModel.updateOne({_id: nominee},{ $addToSet: {voters: houseNo}})
            console.log(`${nominee.name} updated`)
        }

        await model.nomineeModel.aggregate([
            { $addFields: {votes: {$size: "$voters"}}},
            { $out: "nominees"}
        ])
        console.log('votes count updated')
        res.status(200).send({message: 'vote increased'})
    } catch (e) {
        console.log(e)
        res.status(500).send({message: e})
    }
})

app.get('/api/getVotes', verifyToken, checkVerified, async (req, res) => {
    try {
        const result = await nomineeModel.find({}, {name: 1, voters: 1, votes: 1})
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