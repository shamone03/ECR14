import React, {useEffect, useState} from 'react'
import VotingCard from "./VotingCard";
import {url} from "../assets/js/url";


const Voting = () => {
    const [nominees, setNominees] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://${url}/api/getNominees`, {
                method: 'GET',
                headers: {
                    "Authorization": localStorage.getItem('token'),
                    "Content-Type": "application/json"
                }
            })
            if (res.status === 200) {
                const data = await res.json()
                console.log(data)
                setNominees(data.userNominees)
            }
        }
        fetchData()
        console.log(nominees)
    }, [])

    const nominate = async () => {

    }

    return (
        <>
            <h1 className={'text-center'}>Vote</h1>
            <div className={'d-flex flex-row'}>

                {nominees.map(i => (<VotingCard key={i._id} name={i.name} _id={i._id} votes={i.votes} description={i.description}/>))}
            </div>
        </>
    )
}

export default Voting