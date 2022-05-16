const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    houseNo: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: {type: String},
    names: { type: [{type: String}], required: true}
}, { collection: 'residents'})

exports.userModel = mongoose.model('resident', userSchema)