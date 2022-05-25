const mongoose = require('mongoose')

const dbConn = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to db')
    } catch (e) {
        console.error(e)

    }
}

module.exports = dbConn