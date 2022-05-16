const mongoose = require('mongoose')

const dbConn = async () => {
    try {
        const connection = await mongoose.connect('mongodb+srv://shamone:huWzzjo5Cug4P96l@cluster0.rdj2r.mongodb.net/ECR14?retryWrites=true&w=majority')
        console.log('connected to db')
    } catch (e) {
        console.error(e)

    }
}

module.exports = dbConn