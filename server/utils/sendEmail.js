const nodemailer = require('nodemailer')
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2



module.exports = async (email, subject, text) => {
    const oAuth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    )

    oAuth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    })


    const accessToken = await oAuth2Client.getAccessToken()
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: true,
            auth: {
                type: "OAuth2",
                user:'ecr14.ecr14@gmail.com',
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token
            },
            tls: {
                rejectUnauthorized: false
            }
        })
        await transporter.sendMail({
            from: 'ecr14.ecr14@gmail.com',
            to: email,
            subject: subject,
            text: text
        })
        console.log('email sent')
    } catch (e) {
        console.log('email not sent ' + e)
    }

}