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
                setLoggedIn(true)
                setHouseNo(data.houseNo)
            }
        }
        fetchData()
    }, [])





    return (
        <>
            <RedirectLogin loggedIn={loggedIn}/>
            <div className={'text-center mx-auto'} style={{width: '50%'}}>
                <h1>{houseNo}</h1>
            </div>
        </>

    )
}

export default Home