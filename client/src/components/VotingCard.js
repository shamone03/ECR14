import {Button, Card, Image} from "react-bootstrap";
import image from "../assets/images/placeholder.webp";
import React, {useEffect} from "react";
import {BsDot} from "react-icons/all";

const VotingCard = ({addNom, nom, disabled}) => {
    return (
        <Card bg={'dark'} className={'text-center col-md-3 col-6 pt-2'}>
            <Card.Header>
                <Image src={nom.imgURL} roundedCircle width={150} height={150} alt={'pic'}/>
            </Card.Header>
            <Card.Body>
                <Card.Title>{nom.houseNo}<BsDot/>{nom.name}</Card.Title>
                <Card.Subtitle>{nom.bio}</Card.Subtitle>
                <Card.Text>
                    {nom.description.substring(0, Math.min(nom.description.length, 50)) + '...'}
                </Card.Text>
            </Card.Body>
            {!disabled ? (<Button className={'mb-3 mx-auto'} style={{width:'80%'}} onClick={() => addNom(nom)}>Add</Button>) : <></>}
            <Card.Footer>{nom.votes}</Card.Footer>
        </Card>
    )
}

export default VotingCard