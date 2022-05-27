const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const {userModel, tokenModel} = require("../model/model");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    if (!req.body) {
        res.status(400).send({message: 'no body'})
    }
    console.log(req.body)
    let newUser = userModel({
        houseNo: req.body.houseNo,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        names: req.body.names
    })

    try {
        newUser = await newUser.save()
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
        }
        const token = await tokenModel.findOne({userId: user._id, token: req.params.token})
        if (!token) {
            res.status(400).send({message: 'verification failed'})

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
        res.status(404).send({message: 'no user found'})
    } else {
        if (await bcrypt.compare(req.body.password, user.password)) {
            console.log('password correct')
            const token = jwt.sign({houseNo: user.houseNo, _id: user._id, isAdmin: user.isAdmin, verified: user.verified}, process.env.JWT_SECRET, { expiresIn: '86400s'})
            // console.log(res.header)
            console.log('token ' + token)
            res.status(200).send({message: 'success', token: token})
        } else {
            console.log('password incorrect')
            res.status(401).send({message: 'password incorrect'})
        }
    }
}