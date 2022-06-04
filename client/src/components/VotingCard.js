import {Button, Card} from "react-bootstrap";
import image from "../assets/placeholder.png";
import React, {useState} from "react";

const VotingCard = ({name, _id, votes, sendVote, reps, description}) => {

    const [chosenReps, setChosenReps] = useState([])

    const addRep = (_id) => {
        if (chosenReps.includes(_id)) {

        }
    }

    const cardStyle = {
        width: '18rem',
        color: 'black',
        backgroundColor: 'gray'
    }

    return (
        <Card style={cardStyle} className={'text-center'} key={name}>
            <Card.Img src={image}/>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle>{description}</Card.Subtitle>
            </Card.Body>
            <Button className={'mb-3 mx-auto'} style={{width:'80%'}} onClick={() => sendVote(_id)}>Vote</Button>
            <Card.Footer>{votes}</Card.Footer>
        </Card>
    )
}

export default VotingCard