import {useEffect, useState} from "react";
import React from 'react';

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
                setHouseNo(data.houseNo)
                setNames(data.names)
            }
        }
        fetchData()
    }, [])


    return (
        <>
            <h1>{houseNo}</h1>
            <p>{names}</p>
        </>
    )
}

export default Home