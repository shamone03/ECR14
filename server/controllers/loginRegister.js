const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const uploadPicture = require("../utils/uploadPicture")
const {userModel, tokenModel} = require("../model/model");
const jwt = require("jsonwebtoken");

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

        const code = crypto.randomBytes(32).toString("hex")

        await tokenModel.updateOne({userId: user._id}, {token: code}, {upsert: true})
        console.log('token uploaded')

        const url = `${process.env.CLIENT_URL}/reset/${user._id}/reset/${code}`
        await sendEmail(user.email, `Reset Password for ${req.body.houseNo}`, `Click this link to reset your password(expires in 5 minutes): ${url}`)
        return res.status(200).send()
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
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
        console.log('email verified password reset')
        await token.remove()
        console.log('token removed')
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
    let newUser = userModel({
        houseNo: req.body.houseNo,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        names: req.body.names,
        number: req.body.number,
    })

    try {
        newUser = await newUser.save()
        console.log('user saved')
        if (req.body.imgBase64.length > 0) {
            uploadPicture(req.body.imgBase64, 'profilepics', newUser._id)
        }

        const token = await new tokenModel({
            userId: newUser._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save()

        const url = `${process.env.CLIENT_URL}/verify/${newUser._id}/verify/${token.token}`
        await sendEmail(newUser.email, `Verification Email for ${req.body.houseNo}`, `Click this link to verify your email(expires in 5 minutes):${url}`)

        return res.status(200).send({message: 'user saved'})

    } catch (e) {
        console.log(e)
        res.status(500).send({message: 'not saved', e})
    }
}

exports.verifyEmailLink = async (req, res) => {
    try {
        const user = await userModel.findOne({_id: req.params.id})
        if (!user) {
            console.log('no user found')
            res.status(400).send({message: 'no user found'})
            return
        }
        const token = await tokenModel.findOne({userId: user._id, token: req.params.token})
        if (!token) {
            console.log('no token found')
            res.status(400).send({message: 'verification failed'})
            return
        }

        await userModel.updateOne({_id: user._id}, {verified: true})
        console.log('email verified')
        await token.remove()
        console.log('token removed')
        res.status(200).send({message: 'email verified'})
    } catch (e) {
        console.log(e)
        res.status(500).send({message: 'verification failed'})
    }
}

exports.login = async (req, res) => {

    if (!req.body) {
        res.status(500).send({message: 'no body'})
    }

    const user = await userModel.findOne({houseNo: req.body.houseNo})
    if (!user) {
        console.log('no user')
        res.status(404).send({message: 'invalid details'})
    } else {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({houseNo: user.houseNo, _id: user._id, isAdmin: user.isAdmin, verified: user.verified}, process.env.JWT_SECRET, { expiresIn: '86400s'})
            res.cookie('jwtToken', token, {httpOnly: true, secure: true, sameSite: 'strict'})
            res.status(200).send({message: 'success'})
        } else {
            res.status(401).send({message: 'invalid details'})
        }
    }
}

exports.logout = (req, res) => {
    try {
        res.cookie('jwtToken', '', {httpOnly: true, secure: true, sameSite: 'strict'})
        console.log('logged out')
        res.status(200).send({message: 'logged out'})
    } catch (e) {
        console.log('unable to logout')
        console.log(e)
        res.status(500).send({message: 'unable to logout'})
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