const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const {userModel, tokenModel} = require("../model/model");
const jwt = require("jsonwebtoken");
const stream = require("stream");
const {Storage} = require("@google-cloud/storage");

exports.resetPassword = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({message: 'no body'})
    }
    try {
        const user = await userModel.findOne({houseNo: req.body.houseNo}, {_id: 1, email: 1})
        if (!user) {
            console.log('user not found')
            return res.status(404).send({message: 'user not found'})

        }
        // const token = await new tokenModel({
        //     userId: user._id,
        //     token: crypto.randomBytes(32).toString("hex")
        // }).save()
        const code = crypto.randomBytes(32).toString("hex")

        const token = await tokenModel.updateOne({userId: user._id}, {token: code}, {upsert: true})

        const url = `${process.env.CLIENT_URL}/reset/${user._id}/reset/${code}`
        await sendEmail(user.email, 'reset password', url)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

exports.verifyReset = async (req, res) => {
    try {
        const user = await userModel.findOne({_id: req.params.id})
        if (!user) {
            res.status(400).send({message: 'no user found'})
            return
        }
        const token = await tokenModel.findOne({userId: user._id, token: req.params.token})
        if (!token) {
            res.status(400).send({message: 'reset failed'})
            return
        }

        await userModel.updateOne({_id: user._id}, {verified: true, password: await bcrypt.hash(req.body.password, 10), registeredArtificially: false})
        await token.remove()
        res.status(200).send({message: 'email verified password reset'})
    } catch (e) {
        console.log(e)
        res.status(500).send({message: 'reset failed'})
    }
}

exports.register = async (req, res) => {

    if (!req.body) {
        res.status(400).send({message: 'no body'})
    }
    const storage = new Storage()
    const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET)
    let newUser = userModel({
        houseNo: req.body.houseNo,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        names: req.body.names,
        number: req.body.number,
        residentType: req.body.residentType
    })

    try {
        newUser = await newUser.save()
        const bufferStream = new stream.PassThrough()
        bufferStream.end(req.body.imgBase64, 'base64')
        const cloudFile = bucket.file(`${newUser._id}.png`)
        bufferStream.pipe(cloudFile.createWriteStream({
            cacheControl: "private, max-age=0, no-transform"
        })).on('error', (e) => {
            console.log('error pic uploading')
            res.status(500).send({e})
        }).on('finish', async () => {
            console.log('pic uploaded')
            try {
                await userModel.findOneAndUpdate({_id: newUser._id}, {imgURL: `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/${newUser._id}.png`})
            } catch (e) {
                console.log('error updating img url')
                console.log(e)
                res.status(500).send({message: 'error updating img url', e})
            }
        })
        const token = await new tokenModel({
            userId: newUser._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save()

        const url = `${process.env.CLIENT_URL}/verify/${newUser._id}/verify/${token.token}`
        await sendEmail(newUser.email, 'verify email', url)

        res.status(200).send({message: 'user saved'})

    } catch (e) {
        console.log(e)
        res.status(500).send({message: 'not saved', e})
    }
}

exports.verifyEmail = async (req, res) => {
    try {
        const user = await userModel.findOne({_id: req.params.id})
        if (!user) {
            res.status(400).send({message: 'no user found'})
            return
        }
        const token = await tokenModel.findOne({userId: user._id, token: req.params.token})
        if (!token) {
            res.status(400).send({message: 'verification failed'})
            return
        }

        await userModel.updateOne({_id: user._id}, {verified: true})
        await token.remove()
        res.status(200).send({message: 'email verified'})
    } catch (e) {
        res.status(500).send({message: 'verification failed'})
    }
}

exports.login = async (req, res) => {

    if (!req.body) {
        res.status(500).send({message: 'no body'})
    }

    const user = await userModel.findOne({houseNo: req.body.houseNo})
    console.log(user)
    if (!user) {
        console.log('no user')
        res.status(404).send({message: 'invalid details'})
    } else {
        if (await bcrypt.compare(req.body.password, user.password)) {
            console.log('password correct')
            const token = jwt.sign({houseNo: user.houseNo, _id: user._id, isAdmin: user.isAdmin, verified: user.verified}, process.env.JWT_SECRET, { expiresIn: '86400s'})
            // console.log(res.header)
            console.log('token ' + token)
            res.status(200).send({message: 'success', token: token})
        } else {
            console.log('password incorrect')
            res.status(401).send({message: 'invalid details'})
        }
    }
}

exports.registered = async (req, res) => {
    try {
        const registered = await userModel.find({}, {houseNo: 1, email: 1, _id: 0, registeredArtificially: 1})
        for (let i of registered) {
            i.email = i.email.charAt(0) + '**********' + i.email.slice(i.email.indexOf("@") - 1)
        }
        res.status(200).send(registered)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}