import {useEffect, useState} from "react";
import React from 'react';

import Voting from "./Voting";
import {Link} from "react-router-dom";

const Home = () => {
    const [houseNo, setHouseNo] = useState('')
    const [names, setNames] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8080/api/getUser', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token')
                }
            })
            if (res.status === 200) {
                const data = await res.json()
                console.log(data)
                setHouseNo(data.houseNo)
                setNames(data.names)
            }
        }
        fetchData()
    }, [])

    function Names() {
        return (
            names.map(i => (<p key={i._id}>{i.name}</p>))
        )
    }
    return (
        <>

            <h1>{houseNo}</h1>
            <Names/>
            <Link to={'/vote'}>vote now</Link>
        </>
    )
}

export default Home