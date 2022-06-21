import {Button, Card} from "react-bootstrap";
import image from "../assets/images/placeholder.webp";
import React, {useState} from "react";

const VotingCard = ({addNom, nom}) => {
    const cardStyle = {
        width: '',
        color: 'black',
        backgroundColor: 'gray'
    }

    return (
        <Card style={cardStyle} className={'text-center col-md-3 col-6 pt-2'}>
            <Card.Img src={image} className={''}/>
            <Card.Body>
                <Card.Title>{nom.name}</Card.Title>
                <Card.Subtitle>{nom.description}</Card.Subtitle>
            </Card.Body>
            <Button className={'mb-3 mx-auto'} style={{width:'80%'}} onClick={() => addNom(nom)}>Add</Button>
            <Card.Footer>{nom.votes}</Card.Footer>
        </Card>
    )
}

export default VotingCard