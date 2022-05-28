import {useEffect, useState} from "react";
import React from 'react';
import {Link, Navigate} from "react-router-dom";
import {Button, Offcanvas} from "react-bootstrap";
import styles from '../css/Home.module.css'
import RedirectLogin from "./RedirectLogin";
import {url} from "../assets/js/url";
import {AiOutlineClose} from "react-icons/all";


const Home = () => {
    const [houseNo, setHouseNo] = useState('')
    const [names, setNames] = useState([])
    const [verified, setVerified] = useState(false)
    const [showNames, setShowNames] = useState(false)
    const [loggedIn, setLoggedIn] = useState(true)
    const [showMenu, setShowMenu] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${url}/api/getUser`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token')
                }
            })
            if (res.status === 401) {
                setLoggedIn(false)
            }
            if (res.status === 200) {
                const data = await res.json()
                console.log(data)
                setVerified(data.verified)
                setLoggedIn(true)
                setHouseNo(data.houseNo)
                setNames(data.names)

            }
        }
        fetchData()
    }, [])





    return (
        <>
            <RedirectLogin loggedIn={loggedIn}/>
            <div className={'text-center mx-auto'} style={{width: '50%'}}>
                <h1>{houseNo}</h1>

                <Button variant={'light'} onClick={() => setShowMenu(true)}>Menu</Button>
                <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} style={{backgroundColor: '#161b22'}}>
                    <Offcanvas.Header className={'d-flex justify-content-between'} closeVariant={'white'}>
                        <Offcanvas.Title>Menu</Offcanvas.Title>
                        <Button variant={`outline-light ${styles.closeButtonStyle}`} onClick={() => setShowMenu(false)}><AiOutlineClose size={25}/></Button>
                    </Offcanvas.Header>
                    <Offcanvas.Body className={'d-flex flex-column align-content-stretch'}>
                        <div>
                            <Link className={`${styles.linkStyle} mt-3 btn btn-light`} to={'/vote'}>Voting</Link>
                        </div>
                        <div>
                            <Link className={`${styles.linkStyle} mt-3 btn btn-light`} to={'/settings'}>Profile Settings</Link>
                        </div>
                        <div>
                            <Link className={`${styles.linkStyle} mt-3 btn btn-light`} to={'/construction'}>Document Archive</Link>
                        </div>
                        <div>
                            <Link className={`${styles.linkStyle} mt-3 btn btn-light`} to={'/construction'}>Events</Link>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
        </>

    )
}

export default Home