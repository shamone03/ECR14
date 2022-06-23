const {surveyModel} = require("../model/model");
const jwt = require("jsonwebtoken");

exports.postSurvey = async (req, res) => {

    try {
        const survey = new surveyModel({
            surveyName: 'survey1',
            houseNo: jwt.decode(req.headers['authorization']).houseNo,
            responses: req.body.responses,
        })
        await survey.save()
        res.status(200).send({message: 'saved'})
    } catch (e) {
        console.log(e.code + 'not saved')
        if (e.code === 11000) {
            return res.status(403).send({message: 'already submitted'})
        }
        res.status(500).send({message: 'not saved'})

    }

}

exports.getSurveyDetails = async (req, res) => {

    try {
        const yes = await surveyModel.find({response: 'Yes'})
        const no = await surveyModel.find({response: 'No'})
        const notSure = await surveyModel.find({response: 'Not Sure'})
        console.log('yes ' + yes)
        console.log('no ' + no)
        console.log('notSure ' + notSure)
        res.status(200).send({yes, no, notSure})
    } catch (e) {
        res.status(500).send(e)
    }
}