import {useEffect, useState} from "react";
import React from 'react';
import {Link, Navigate} from "react-router-dom";
import {Button, Image, Offcanvas} from "react-bootstrap";
import styles from '../css/Home.module.css'
import RedirectLogin from "./RedirectLogin";
import {url} from "../assets/js/url";
import {AiOutlineClose} from "react-icons/all";
import placeholder from "../assets/placeholder.png";

const Home = () => {
    const [houseNo, setHouseNo] = useState('')
    const [loggedIn, setLoggedIn] = useState(true)
    const [name, setName] = useState([])
    const [imgAddress, setImgAddress] = useState('')

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
                setName(data.names[0].name)
                setImgAddress(data.imgURL)
            }
        }
        fetchData()
    }, [])





    return (
        <>
            <RedirectLogin loggedIn={loggedIn}/>

            <div className={'container text-center'}>
                {imgAddress ? (
                    <Image src={imgAddress} roundedCircle width={200} height={200} alt={'prof pic'} className={'my-5'}/>
                ) : (
                    <Image src={placeholder} roundedCircle width={200} height={200} alt={'prof pic'} className={'my-5'}/>
                )}
                <h1>{houseNo}</h1>
                <h2>Hello, {name}.</h2>
                <h3>Use the profile tab to edit your details.</h3>
                <h3>Thank you for signing up!</h3>
            </div>
        </>

    )
}

export default Home