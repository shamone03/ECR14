const nodemailer = require('nodemailer')

module.exports = async (email, subject, text) => {
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
                accessToken: "ya29.a0ARrdaM-xpkcg65jAA2wSmE5_ZyxX7DQwModCdbeUQVWQjnFzU040rh-2UFMeUZsGJQi6Il7vU_I_VCOhVFem1wGoJlrE9lX38qqXd6oO3_i7xRcgiN9Y3iV92qZZDfYj-p2YsinoIEiwDOhDxQmUrS6yzqo-"
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