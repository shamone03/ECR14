const express = require('express')
const morgan = require('morgan')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const model = require('./server/model/model')
const sendEmail = require('./server/utils/sendEmail')
const crypto = require('crypto')
const cors = require('cors')
const app = express()

app.use(cors({origin: '*'}))
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const dbConn = require('./server/connection/connection')
const path = require("path")
const {tokenModel, nomineeModel, surveyModel} = require("./server/model/model");

dbConn()
// app.use(express.static(path.join(__dirname, 'client', 'build')))
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
// })

app.listen(8080, (req, res) => {
    console.log('server on 8080')
})

app.post('/api/register', async (req, res) => {

    if (!req.body) {
        res.status(400).send({message: 'no body'})
    }
    console.log(req.body)
    let newUser = model.userModel({
        houseNo: req.body.houseNo,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        names: req.body.names
    })

    try {
        newUser = await newUser.save()
        const token = await new model.tokenModel({
            userId: newUser._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save()

        const url = `https://ecr14.org/api/${newUser._id}/verify/${token.token}`
        await sendEmail(newUser.email, 'verify email', url)

        res.status(200).send({message: 'user saved'})
        
    } catch (e) {
        console.log(e)
        res.status(500).send({message: 'not saved', e})
    }
})

app.post('/api/login', async (req, res) => {

    if (!req.body) {
        res.status(500).send({message: 'no body'})
    }

    const user = await model.userModel.findOne({houseNo: req.body.houseNo})
    console.log(user)
    if (!user) {
        console.log('no user')
        res.status(404).send({message: 'no user found'})
    } else {
        if (await bcrypt.compare(req.body.password, user.password)) {
            console.log('password correct')
            const token = jwt.sign({houseNo: user.houseNo, _id: user._id}, 'uagvreigvlaegrvkae', { expiresIn: '86400s'})
            // console.log(res.header)
            console.log('token ' + token)
            res.status(200).send({message: 'success', token: token})
        } else {
            console.log('password incorrect')
            res.status(401).send({message: 'password incorrect'})
        }
    }
})

app.get('/api/getUser', async (req, res) => {

    const token = req.headers['authorization']
    console.log(token)

    try {

        const houseNo = jwt.verify(token, 'uagvreigvlaegrvkae').houseNo
        try {
            const user = await model.userModel.findOne({houseNo: houseNo})
            res.status(200).send(user)
        } catch (e) {
            res.status(404).send(e)
        }
    } catch (e) {
        res.status(401).send(e)
    }


})

app.get('/api/:id/verify/:token', async (req, res) => {
    try {
        const user = await model.userModel.findOne({_id: req.params.id})
        if (!user) {
            res.status(400).send({message: 'no user found'})
        }
        const token = await model.tokenModel.findOne({userId: user._id, token: req.params.token})
        if (!token) {
            res.status(400).send({message: 'verification failed'})

        }

        await model.userModel.updateOne({_id: user._id}, {verified: true})
        await token.remove()
        res.status(200).send({message: 'email verified'})
    } catch (e) {
        res.status(500).send({message: 'verification failed'})
    }
})

app.get('/api/verifyEmail', async (req, res) => {

    const jwtToken = req.headers['authorization']

    try {
        const houseNo = jwt.verify(jwtToken, 'uagvreigvlaegrvkae').houseNo
        try {
            const user = await model.userModel.findOne({houseNo: houseNo})
            if (!user.verified) {
                let token = await model.tokenModel.findOne({userId: user._id})
                if (!token) {
                    token = await new model.tokenModel({
                        userId: newUser._id,
                        token: crypto.randomBytes(32).toString("hex")
                    }).save()

                    const url = `http://localhost:8080/api/${user._id}/verify/${token.token}`
                    await sendEmail(user.email, 'verify email', url)
                }
                return res.status(400).send({message: 'email already sent'})
            }

        } catch (e) {
            res.status(500).send({error: e})
        }
    } catch (e) {
        res.status(401).send({message: 'token invalid'})
    }

})

app.post('/api/addNominee', async (req, res) => {


    const nominee = new model.nomineeModel({
        name: req.body.name,
        houseNo: req.body.houseNo,
        description: req.body.description
    })

    try {
        await nominee.save()
        res.status(200).send({message: 'nominee saved'})
    } catch (e) {
        res.status(500).send({message: 'nominee not saved'})
    }
})

app.post('/api/vote', async (req, res) => {


    try {
        await nomineeModel.updateOne({name: req.body.nominees[0].rep1},{ $addToSet: {voters: req.body.houseNo}})
        await nomineeModel.updateOne({name: req.body.nominees[1].rep2},{ $addToSet: {voters: req.body.houseNo}})
        await nomineeModel.updateOne({name: req.body.nominees[2].rep3},{ $addToSet: {voters: req.body.houseNo}})
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

app.get('/api/getVotes', async (req, res) => {
    try {
        const result = await nomineeModel.find({$project: { voters: 1, votes: 1 }})
        res.status(200).send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send({message: 'could not get votes', e})
    }
})

app.post('/api/survey', async (req, res) => {


    try {
        const newSurvey = new surveyModel({
            houseNo: req.body.houseNo,
            number: req.body.number,
            email: req.body.email,
            response: req.body.response
        })
        await newSurvey.save()
        res.status(200).send({message: 'saved'})
    } catch (e) {
        // console.log(e)
        if (e.code === 11000) {
            // try {
            //     await surveyModel.findOneAndUpdate({email: req.body.email,houseNo: req.body.houseNo}, {
            //         number: req.body.number,
            //         response: req.body.response
            //     })
            //     res.status(200).send({message: 'updated'})
            // } catch (e) {
            //     res.status(500).send({message: 'did not update', e})
            // }
            res.status(200).send({message: 'exists'})
        } else {
            res.status(500).send({message: 'did not save', e})
        }

    }

})

app.get('/api/surveyDetails', async (req, res) => {


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
