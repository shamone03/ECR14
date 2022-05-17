const mongoose = require('mongoose')
const {Schema} = require("mongoose");

const userSchema = new mongoose.Schema({
    houseNo: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: {type: String},
    names: [{name:{type: String}, key:{type: Number} }, ],
    verified: {type: Boolean, default: false}
}, { collection: 'residents'})

const tokenSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "resident",
        unique: true
    },
    token: {type: String, required: true},
    createdAt: {type: Date, default: Date.now(), expiresIn: 3600} //1hour
})

exports.userModel = mongoose.model('resident', userSchema)
exports.tokenModel = mongoose.model('token', tokenSchema)