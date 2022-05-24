import React, {useState} from 'react'
import VotingCard from "./VotingCard";
const Voting = () => {
    const [noms, setNoms] = useState([
        {
            id: 1,
            name: 'A',
            votes: 0
        },
        {
            id: 2,
            name: 'B',
            votes: 0
        },
        {
            id: 3,
            name: 'C',
            votes: 0
        },
        {
            id: 4,
            name: 'D',
            votes: 0
        }
    ])

    const incrementVote = (name) => {
        let newNoms = [...noms]
        newNoms = noms.map((i) => {

        })
        console.log(newNoms)
    }

    return (
        <div className={"d-flex flex-row"}>
            {noms.map((i) => (<VotingCard key={i.id} name={i.name} votes={i.votes} incrementVote={incrementVote}/>))}
        </div>
    )
}

export default Voting