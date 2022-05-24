import {useEffect, useState} from "react";
import React from 'react';
import {Link} from "react-router-dom";

const Home = () => {
    const [houseNo, setHouseNo] = useState('')
    const [names, setNames] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('https://ecr14.org/api/getUser', {
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

    const Nominate = () => {
        return (
            <>

            </>

            // <Form>
            //     <Form.Label>Choose a name from your house to nominate</Form.Label>
            //     <Dropdown>
            //         <Dropdown.Toggle>
            //             {chosenName}
            //         </Dropdown.Toggle>
            //         <Dropdown.Menu>
            //             {names.map(i => (<Dropdown.Item onClick={() => setChosenName(i)}>{i}</Dropdown.Item>))}
            //         </Dropdown.Menu>
            //     </Dropdown>
            // </Form>
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