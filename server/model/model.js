const mongoose = require('mongoose')
const {Schema} = require("mongoose");

const userSchema = new mongoose.Schema({
    houseNo: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    names: [{name:{type: String}, age:{type:Number}, residentType:{type: String, enum: ['Owner', 'Family', 'Co-Owner', 'Tenant']}}],
    verified: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    number: {type: String},
    registeredArtificially: {type: Boolean, default: false},
    imgURL: {type: String},
    parkingNos: [{type: Number}]
}, { collection: 'residentsDEV', timestamps: true })

const tokenSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "resident",
        unique: true
    },
    token: {type: String, required: true},
    createdAt: {type: Date, default: Date.now(), expires: 300} // 5 mins
}, {collection: 'tokens'})

const voterSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, required: true, ref: 'resident'},
    pollId: {type: mongoose.Types.ObjectId, required: true, ref: 'poll'}
}, {collection: 'voters'})

voterSchema.index({userId: 1, pollId: 1}, {unique: true})

const nomineeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    houseNo: {type: String, required: true},
    votes: {type: Number, required: true, default: 0},
    voters: [{type: String}],
    bio: {type: String},
    description: {type: String},
    poll: {type: mongoose.Types.ObjectId, ref: "poll"},
    imgURL: {type: String}
}, {collection: 'nominees', timestamps: true})

nomineeSchema.index({houseNo: 1, poll: 1}, {unique: true})

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
    nominees: [{type: Schema.Types.ObjectId, ref: "nominee"}],
    description: {type: String}
}, {collection: 'polls', timestamps: true})

pollSchema.index({forBlock: 1, position: 1}, {unique: true})

exports.pollModel = new mongoose.model('poll', pollSchema)
exports.surveyModel = mongoose.model('survey', surveySchema)
exports.nomineeModel = mongoose.model('nominee', nomineeSchema)
exports.userModel = mongoose.model('resident', userSchema)
exports.tokenModel = mongoose.model('token', tokenSchema)
exports.voterModel = mongoose.model('voter', voterSchema)