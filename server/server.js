const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors({origin: '*'}))
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(5000, (req, res) => {
    console.log('server on 5000')
})

app.get('/api/test', (req, res) => {
    res.status(200).send(JSON.stringify({ message: 'hello'} ))
})