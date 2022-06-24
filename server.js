const cors = require('cors')
const nocache = require('nocache')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const express = require('express')
const path = require("path")
require('dotenv').config()
const dbConn = require('./server/connection/connection')

const app = express()
app.use(cors({origin: 'http://localhost:3000', credentials: true}))
app.use(express.urlencoded({extended: true, limit: '50mb'}))
app.use(express.json({limit: '50mb'}))
app.use(cookieParser())
app.use(morgan('tiny'))
app.use(nocache())
app.use('/', require('./server/routes/userRouter'))
app.use('/', require('./server/routes/profileRouter'))
app.use('/', require('./server/routes/voteRouter'))
app.use('/', require('./server/routes/surveyRouter'))

app.listen(process.env.PORT, () => {
    console.log(`server on ${process.env.PORT}`)
})

dbConn()

app.use(express.static(path.join(__dirname, 'client', 'build')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})