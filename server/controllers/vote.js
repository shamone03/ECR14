const jwt = require("jsonwebtoken");
const model = require("../model/model");
const {pollModel, nomineeModel} = require("../model/model");

exports.addPoll = async (req, res) => {
    const _id = jwt.decode(req.cookies['jwtToken'])._id
    const isAdmin = jwt.decode(req.cookies['jwtToken']).isAdmin
    if (!isAdmin) {
        console.log('not admin')
        res.status(401).send({message: 'not admin'})
        return
    }
    const poll = new model.pollModel({
        createdBy: _id,
        position: req.body.position,
        forBlock: req.body.forBlock,
        representatives: req.body.representatives
    })

    try {
        const savedPoll = await poll.save()
        console.log('poll saved')
        res.status(200).send(savedPoll)
    } catch (e) {
        console.log('poll not saved')
        console.log(e)
        res.status(500).send(e)
    }
}

exports.getPolls = async (req, res) => {
    const isAdmin = jwt.decode(req.cookies['jwtToken']).isAdmin
    const block = jwt.decode(req.cookies['jwtToken']).houseNo.charAt(0).toUpperCase()
    try {
        const polls = await pollModel.find()
        console.log('polls found')
        const userPolls = []
        for (let poll of polls) {
            if (poll.forBlock === block) {
                userPolls.push(poll)
            }
        }
        if (isAdmin) {
            console.log('isAdmin polls and userPolls sent')
            return res.status(200).send({polls, userPolls})
        } else {
            console.log('userPolls sent')
            return res.status(200).send({userPolls})
        }
    } catch (e) {
        console.log('polls not found')
        console.log(e)
        return res.status(404).send({e})
    }

}

exports.addNominee = async (req, res) => {
    const nominee = new model.nomineeModel({
        name: req.body.name,
        houseNo: req.body.houseNo,
        description: req.body.description,
        poll: req.body.pollId
    })

    try {
        await nominee.save()
        console.log('nominee saved')
        res.status(200).send({message: 'nominee saved'})
    } catch (e) {
        console.log('nominee not saved')
        console.log(e)
        res.status(500).send({message: 'nominee not saved', e})
    }
}

exports.getNominees = async (req, res) => {
    const block = jwt.decode(req.cookies['jwtToken']).houseNo.charAt(0)
    const isAdmin = jwt.decode(req.cookies['jwtToken']).isAdmin
    try {
        const nominees = await model.nomineeModel.find().populate('poll')
        const userNominees = nominees.filter((n) => n.poll.forBlock === block)
        if (isAdmin) {
            console.log('isAdmin userNominees nominees sent')
            res.status(200).send({userNominees, nominees})
        } else {
            console.log('userNominees sent')
            res.status(200).send({userNominees})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({e})
    }
}

exports.voteNominee = async (req, res) => {
    const houseNo = jwt.decode(req.cookies['jwtToken']).houseNo
    const nomineeIds = req.body.nomineeIds

    try {

        const nominee = await nomineeModel.findOne({_id: nomineeIds[0]}).populate('poll').exec()

        if (nomineeIds.length !== nominee.poll.representatives) {
            console.log(`sent reps ${nomineeIds.length} and required reps ${nominee.poll.representatives} do not match`)
            res.status(400).send({message: `sent reps ${nomineeIds.length} and required reps ${nominee.poll.representatives} do not match`})
            return
        }

        for (let nominee of nomineeIds) {
            await nomineeModel.updateOne({_id: nominee},{ $addToSet: {voters: houseNo}})
            console.log(`${nominee.name} updated`)
        }

        await model.nomineeModel.aggregate([
            { $addFields: {votes: {$size: "$voters"}}},
            { $out: "nominees"}
        ])
        console.log('votes count updated')
        res.status(200).send({message: 'vote increased'})
    } catch (e) {
        console.log(e)
        res.status(500).send({message: e})
    }
}

exports.getVotes = async (req, res) => {
    try {
        const result = await nomineeModel.find({}, {name: 1, voters: 1, votes: 1})
        res.status(200).send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send({message: 'could not get votes', e})
    }
}