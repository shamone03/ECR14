const {Storage} = require("@google-cloud/storage");
const stream = require("stream");
const {userModel} = require("../model/model");

module.exports = (imgBase64, toFolder, id) => {
    try {
        const storage = new Storage()
        const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET)
        const bufferStream = new stream.PassThrough()
        bufferStream.end(imgBase64, 'base64')
        const cloudFile = bucket.file(`${toFolder}/${id}.webp`)
        return bufferStream.pipe(cloudFile.createWriteStream({
            metadata: {
                cacheControl: "no-store"
            }
        })).on('error', (e) => {
            console.log(e)
            console.log('error pic uploading')
            return false
        }).on('finish', async () => {
            console.log('pic uploaded')
            try {
                await userModel.findOneAndUpdate({_id: id}, {imgURL: `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/${toFolder}/${id}.webp`})
                console.log('imgURL updated')
                return true
            } catch (e) {
                console.log('error updating img url')
                console.log(e)
                return false
            }
        })

    } catch (e) {
        console.log(e)
        return false
    }

}