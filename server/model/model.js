const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    houseNo: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: {type: String},
    names: [{name:{type: String}, key:{type: Number} }, ]
}, { collection: 'residents'})

exports.userModel = mongoose.model('resident', userSchema)