const nodemailer = require('nodemailer')
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2



module.exports = async (email, subject, text) => {
    const oAuth2Client = new OAuth2(
        "895699940676-5dbevjl83o11k1a3flvqrh0eak9oqs9t.apps.googleusercontent.com",
        "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",
        "https://developers.google.com/oauthplayground"
    )

    oAuth2Client.setCredentials({
        refresh_token: "1//04Kv-XU115MbCCgYIARAAGAQSNwF-L9IrcbEs6cszu1pq33CMNO0wE9iE5MgdBO7Mow9vGjTnQK_cN0zsHmApNgIWTCQcQNSAUrE"
    })


    const accessToken = await oAuth2Client.getAccessToken()
    console.log(accessToken)
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: true,
            auth: {
                type: "OAuth2",
                user:'ecr14.ecr14@gmail.com',
                clientID: "895699940676-5dbevjl83o11k1a3flvqrh0eak9oqs9t.apps.googleusercontent.com",
                clientSecret: "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",
                refreshToken: "1//04Kv-XU115MbCCgYIARAAGAQSNwF-L9IrcbEs6cszu1pq33CMNO0wE9iE5MgdBO7Mow9vGjTnQK_cN0zsHmApNgIWTCQcQNSAUrE",
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