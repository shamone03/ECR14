import {Button, Card} from "react-bootstrap";
import image from "../assets/placeholder.png";
import React from "react";

const VotingCard = ({name, votes, incrementVote}) => {
    const sendVote = () => {
        // console.log(name)
        incrementVote(name)
    }

    return (
        <Card style={{width: '18rem'}} className={'text-center'} key={name}>
            <Card.Img src={image}/>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
            </Card.Body>
            <Button className={'mb-3 mx-auto'} style={{width:'80%'}} onClick={sendVote}>Vote</Button>
            <Card.Footer>{votes}</Card.Footer>
        </Card>
    )
}

export default VotingCard