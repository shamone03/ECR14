const model = require("../model/model");
const uploadPicture = require('../utils/uploadPicture')
const {pollModel, nomineeModel, voterModel} = require("../model/model");

exports.addPoll = async (req, res) => {
    if (!req.ecr14user.isAdmin) {
        console.log('not admin')
        res.status(401).send({message: 'not admin'})
        return
    }

    try {
        const poll = new pollModel({
            createdBy: req.ecr14user._id,
            position: req.body.position,
            forBlock: req.body.forBlock,
            representatives: req.body.representatives,
            description: req.body.description
        })
        const savedPoll = await poll.save()
        console.log('poll saved')
        return res.status(200).send(savedPoll)
    } catch (e) {
        if (e.code === 11000) {
            console.log('poll not saved')
            console.log(`position ${req.body.position} for block ${req.body.forBlock} already exists`)
            return res.status(400).send({e})
        }
        console.log('poll not saved')
        console.log(e)
        return res.status(500).send({e})
    }


}

exports.getPolls = async (req, res) => {
    try {
        const polls = await pollModel.find().populate({path: 'createdBy', select: 'houseNo'}).
                                             populate({path: 'nominees',  select: 'houseNo votes voters'})

        console.log('polls found')
        const userPolls = polls.filter(p => p.forBlock === req.ecr14user.houseBlock || p.forBlock === 'all')

        if (req.ecr14user.isAdmin) {
            console.log('isAdmin polls and userPolls sent')
            return res.status(200).send({userPolls, polls})
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
    // check if user is in the same block as poll they are nominating for or if poll is for all blocks
    try {
        const forBlock = await pollModel.findOne({_id: req.body.pollId}, {forBlock: 1})
        // if (forBlock.forBlock !== jwt.decode(req.cookies['jwtToken']).houseNo.charAt(0).toUpperCase()) {
        if (forBlock.forBlock !== 'all') {
            // houseNo.chatAt(0).toUpperCase to be replaced with req.ecr14user.houseBlock
            if (forBlock.forBlock !== req.ecr14user.houseBlock.toUpperCase()) {
                // houseNo.chatAt(0).toUpperCase to be replaced with req.ecr14user.houseBlock
                return res.status(400).send({message: `${forBlock.forBlock} block poll signup not available for sent block ${req.ecr14user.houseBlock}`})
            }
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send({e})
    }


    try {
        // saving user to nominees collection, which will also check if they have already nominated for this poll using compound index houseNo and poll
        const nominee = new model.nomineeModel({
            name: req.body.name,
            houseNo: req.ecr14user.houseNo,
            bio: req.body.bio,
            description: req.body.description,
            poll: req.body.pollId
        })
        const newNom = await nominee.save()
        console.log('nominee doc saved')
        if (req.body.hasOwnProperty('imgBase64')) {
            if (req.body.imgBase64.length > 0) {
                if (!uploadPicture(req.body.imgBase64, 'nomineepics', newNom._id)) {
                    return res.status(500).send({message: 'error uploading pic'})
                }
            }
        }

        // if user has not already nominated then add them to the list of nominees in poll collection for applied poll
        try {
            await pollModel.findOneAndUpdate({_id: req.body.pollId}, {$addToSet: {nominees: newNom._id}})
            console.log('added id to poll nominees')
            return res.status(200).send()
        } catch (e) {
            console.log(e)
            return res.status(500).send({e})
        }
    } catch (e) {
        console.log(e)
        if (e.code === 11000) {
            console.log(`${req.ecr14user.houseNo} already signed up for poll ${req.body.pollId}`)
            return res.status(400).send(`${req.body.houseNo} already signed up for poll ${req.body.pollId}`)
        }
        return res.status(500).send({e})
    }


}

exports.getNominees = async (req, res) => {
    try {
        const nominees = await nomineeModel.find().populate('poll', 'forBlock position')
        const userNominees = nominees.filter((n) => n.poll.forBlock === req.ecr14user.houseBlock || n.poll.forBlock === 'all')
        if (req.ecr14user.isAdmin) {
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
    const nomineeIds = req.body.nomineeIds
    const nominee = await nomineeModel.findOne({_id: nomineeIds[0]}).populate({path: 'poll'})

    if (nomineeIds.length !== nominee.poll.representatives) {
        console.log(`sent reps ${nomineeIds.length} and required reps ${nominee.poll.representatives} do not match`)
        res.status(400).send({message: `sent reps ${nomineeIds.length} and required reps ${nominee.poll.representatives} do not match`})
        return
    }

    try {
        await new voterModel({
            userId: req.ecr14user._id,
            pollId: nominee.poll._id
        }).save()
    } catch (e) {
        if (e.code === 11000) {
            console.log('already voted for this poll')
            return res.status(400).send('You have already voted for this poll')
        }
        console.log(e)
        return res.status(500).send({e})
    }


    try {

        const bulkUpdateArray = nomineeIds.map((id) => {
            return {
                updateOne: {
                    filter: {
                        _id: id,
                    },
                    update: {
                        $addToSet: {voters: req.ecr14user.houseNo}
                    }
                }
            }
        })
        await nomineeModel.bulkWrite(bulkUpdateArray)

        // noinspection GrazieInspection
        await model.nomineeModel.aggregate([
            // replaces votes with length of voters
            { $addFields: {votes: { $size: "$voters" }}},
            { $out: "nominees" }
        ])

    } catch (e) {
        console.log(e)
        res.status(500).send({e})
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