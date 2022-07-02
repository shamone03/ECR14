const jwt = require("jsonwebtoken")
const {userModel, tokenModel} = require("../model/model")
const model = require("../model/model")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")
const uploadPicture = require("../utils/uploadPicture")

exports.updateUser = async (req, res) => {
    if (!req.body) {
        res.status(400).send({message: 'no body'})
    }
    const id = jwt.decode(req.cookies['jwtToken'])._id
    try {
        const user = await userModel.updateOne({_id: id}, {names: req.body.names, number: req.body.number, parkingNos: req.body.parkingNos})
        console.log('user document updated')
        if (req.body.imgBase64.length > 0) {
            uploadPicture(req.body.imgBase64, 'profilepics', id)
        }

        return res.status(200).send()
    } catch (e) {
        console.log(e)
        res.status(500).send({e})
    }
}

exports.sendVerificationEmail = async (req, res) => {

    const houseNo = jwt.decode(req.cookies['jwtToken']).houseNo

    try {
        const user = await model.userModel.findOne({houseNo: houseNo}, {verified: 1, email: 1, _id: 1})
        if (!user.verified) {

            const code = crypto.randomBytes(32).toString("hex")
            const token = await tokenModel.updateOne({userId: user._id, tokenType: 'email'}, {token: code}, {upsert: true})
            console.log('token uploaded')

            const url = `${process.env.CLIENT_URL}/client/${user._id}/verify/${code}`
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
    // console.log(req)
    // console.log(req.cookies.cookieName)
    // console.log(req.headers)
    const houseNo = jwt.decode(req.cookies['jwtToken']).houseNo
    try {
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