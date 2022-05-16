const express = require('express')
const morgan = require('morgan')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
const cors = require('cors')
const model = require('./server/model/model')

app.use(cors({origin: '*'}))
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const dbConn = require('./server/connection/connection')
const path = require("path")

dbConn()
app.use(express.static(path.join(__dirname, 'client', 'build')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

app.listen(8080, (req, res) => {
    console.log('server on 8080')
})

app.post('/api/register', async (req, res) => {
    res.header("Access-Control-Allow-Origin", `*`)
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    if (!req.body) {
        res.status(400).send({message: 'no body'})
    }

    const newUser = model.userModel({
        houseNo: req.body.houseNo,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        names: req.body.names
    })

    try {
        await newUser.save()
        res.status(200).send({message: 'user saved'})
        
    } catch (e) {
        res.status(500).send({message: 'not saved', error: e})
    }
})

app.post('/api/login', async (req, res) => {
    res.header("Access-Control-Allow-Origin", `*`)
    res.header('Access-Control-Allow-Headers', 'Content-Type')
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
    console.log(jwt.verify(token, 'uagvreigvlaegrvkae'))
    const houseNo = jwt.verify(token, 'uagvreigvlaegrvkae').houseNo
    try {
        const user = await model.userModel.findOne({houseNo: houseNo})
        res.status(200).send(user)
    } catch (e) {
        res.status(404).send(e)
    }

})