const mongoose = require('mongoose')
const {Schema} = require("mongoose");

const userSchema = new mongoose.Schema({
    houseNo: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    names: [{name:{type: String}, age:{type:Number}}],
    verified: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    number: {type: String},
    residentType: {type: String},
    registeredArtificially: {type: Boolean, default: false}
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
}, {collection: 'tokens'})

const nomineeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    houseNo: {type: String, required: true, unique: true},
    votes: {type: Number, required: true, default: 0},
    voters: [{type: String}],
    description: {type: String},
    poll: {type: mongoose.Types.ObjectId, ref: "poll"}
}, {collection: 'nominees'})

const surveySchema = new mongoose.Schema({
    surveyName: {type: String, required: true},
    houseNo: {type: String, required: true, unique: true},
    responses: [{question:{type: String}, answer:{type: String}, remarks: {type: String}}],
}, {collection: 'surveys'})

const pollSchema = new mongoose.Schema({
    createdBy: {type: Schema.Types.ObjectId, ref: "resident"},
    position: {type: String, required: true},
    forBlock: {type: String, required: true},
    representatives: {type: Number, default: 1},
    nominees: [{type: Schema.Types.ObjectId, ref: "nominee"}]
}, {collection: 'polls'})

exports.pollModel = new mongoose.model('poll', pollSchema)
exports.surveyModel = mongoose.model('survey', surveySchema)
exports.nomineeModel = mongoose.model('nominee', nomineeSchema)
exports.userModel = mongoose.model('resident', userSchema)
exports.tokenModel = mongoose.model('token', tokenSchema)