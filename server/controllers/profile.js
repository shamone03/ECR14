const jwt = require("jsonwebtoken");
const {userModel} = require("../model/model");
const {Storage} = require("@google-cloud/storage");
const stream = require("stream");
const model = require("../model/model");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.updateUser = async (req, res) => {
    if (!req.body) {
        res.status(400).send({message: 'no body'})
    }
    const id = jwt.decode(req.headers['authorization'])._id
    try {
        const user = await userModel.updateOne({_id: id}, {names: req.body.names, number: req.body.number, parkingNos: req.body.parkingNos})
        console.log('user document updated')
        if (req.body.imgBase64.length > 0) {
            const storage = new Storage()
            const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET)
            const bufferStream = new stream.PassThrough()
            bufferStream.end(req.body.imgBase64, 'base64')
            const cloudFile = bucket.file(`${id}.webp`)
            bufferStream.pipe(cloudFile.createWriteStream({
                metadata: {
                    cacheControl: "no-store"
                }
            })).on('error', (e) => {
                console.log('error pic uploading')
                return res.status(500).send({e})
            }).on('finish', async () => {
                console.log('pic uploaded')
                try {
                    await userModel.findOneAndUpdate({_id: id}, {imgURL: `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/${id}.webp`})
                    console.log('imgURL updated')
                } catch (e) {
                    console.log('error updating img url')
                    console.log(e)
                    return res.status(500).send({message: 'error updating img url', e})
                }
            })
        }

        return res.status(200).send()
    } catch (e) {
        console.log(e)
        res.status(500).send({e})
    }
}

exports.sendVerificationEmail = async (req, res) => {

    const houseNo = jwt.decode(req.headers['authorization']).houseNo

    try {
        const user = await model.userModel.findOne({houseNo: houseNo}, {verified: 1, email: 1, _id: 1})
        if (!user.verified) {
            let token = await model.tokenModel.findOne({userId: user._id})
            if (token) {
                await token.remove()
                console.log('existing token removed')
            }
            token = await new model.tokenModel({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex")
            }).save()
            const url = `${process.env.CLIENT_URL}/verify/${user._id}/verify/${token.token}`
            await sendEmail(user.email, `Verification Email for ${houseNo}`, `Click this link to verify your email(expires in 5 minutes):${url}`)
            res.status(200).send({message: 'email sent'})
        } else {
            console.log('already verified')
            return res.status(400).send({message: 'already verified'})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({error: e})
    }


}

exports.getUser = async (req, res) => {

    const token = req.headers['authorization']
    try {

        const houseNo = jwt.verify(token, process.env.JWT_SECRET).houseNo
        try {
            const user = await model.userModel.findOne({houseNo: houseNo}, {password: 0})
            if (user) {
                console.log('user found')
                res.status(200).send(user)
            } else {
                console.log('user not found')
                res.status(401).send({message: 'empty user'})
            }
        } catch (e) {
            console.log(e)
            res.status(401).send({e})
        }
    } catch (e) {
        console.log(e)
        res.status(401).send({e})
    }


}