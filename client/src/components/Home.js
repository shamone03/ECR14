import {useEffect, useState} from "react";
import React from 'react';
import {Link, Navigate} from "react-router-dom";
import {Button, Offcanvas} from "react-bootstrap";

const Home = () => {
    const [houseNo, setHouseNo] = useState('')
    const [names, setNames] = useState([])
    const [verified, setVerified] = useState(false)
    const [showNames, setShowNames] = useState(false)
    const [loggedIn, setLoggedIn] = useState(true)
    const [showMenu, setShowMenu] = useState(false)

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
                setVerified(data.verified)
                setLoggedIn(true)
                setHouseNo(data.houseNo)
                setNames(data.names)

            }
            if (res.status === 401) {
                setLoggedIn(false)
            }
        }
        fetchData()
    }, [])

    function Names() {
        if (showNames) {
            return (
                <ul className={'list-group mx-auto mt-2 text-center'}>
                    {names.map(i => <li className={'text-center list-group-item list-group-item-action list-group-item-dark'} key={i._id}>{i.name}</li>)}
                </ul>
            )
        } else {
            return (
                <></>
            )
        }

    }

    const RedirectLogin = () => {
        return (
            <>
                {!loggedIn ? (<Navigate to={'/login'}/>) : ('')}
            </>
        )
    }

    const Settings = () => {

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
            <RedirectLogin/>
            <div className={'text-center mx-auto'} style={{width: '50%'}}>
                <h1>{houseNo}</h1>

                <Button variant={'light'} onClick={() => setShowMenu(true)}>Menu</Button>
                <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} style={{backgroundColor: '#161b22'}}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Menu</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className={'text-center'}>
                            <Button variant={'dark'} onClick={() => setShowNames(!showNames)}>Show residents</Button>
                            <Names/>
                        </div>
                        <div className={'mt-3 text-center'}>
                            {verified ? (<h3>You are verified</h3>) : (<h3>You are not verified</h3>)}
                        </div>
                    </Offcanvas.Body>


                </Offcanvas>
            </div>
        </>

    )
}

export default Home