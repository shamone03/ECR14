import {useEffect, useState} from "react";
import React from 'react';
import {Button, Form, Spinner} from "react-bootstrap";
import {Navigate} from "react-router-dom";
import styles from '../css/Login.module.css'
import {url} from "../assets/js/url";

const Login = () => {
    const [houseNo, setHouseNo] = useState('')
    const [password, setPassword] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)

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
                setLoggedIn(true)
            }
        }
        fetchData()
    },[])

    const loginUser = async (e) => {
        e.preventDefault()
        setLoading(true)
        const res = await fetch(`${url}/api/login`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "houseNo": houseNo.charAt(0).toUpperCase() + houseNo.slice(1),
                "password": password
            })
        })
        if (res.status === 200) {
            const data = await res.json()
            localStorage.setItem('token', data.token)
            setLoading(false)
            setLoggedIn(true)
        } else {
            setLoading(false)
            alert('invalid houseNo or password')
        }
    }

    const RedirectHome = () => {
        return (
            <>
                {loggedIn ? (<Navigate to={'/home'}/>) : ''}
            </>
        )
    }

    return (
        <div>
            <RedirectHome/>
            <h1 className={'text-center'}>Login</h1>
            <div className={`${styles.formWrapper} mx-auto`}>
                <Form className={`${styles.formStyle} mx-auto d-flex flex-column justify-content-between align-items-center`}>
                    <Form.Group className={"mb-3 mt-5"}>
                        <Form.Label>Enter Apartment Number</Form.Label>
                        <Form.Control className={styles.inputStyle} type={"text"} placeholder={"example: J606"} onChange={e => setHouseNo(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={"mb-4"} >
                        <Form.Label>Password</Form.Label>
                        <Form.Control className={styles.inputStyle} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                    </Form.Group>
                    {loading ? (
                            <>
                                <Button className={'mt-5'} variant="outline-light" disabled>
                                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                                    Loading...
                                </Button>
                            </>) :
                        (<Button variant={'outline-light'} className={'mt-5'} onClick={loginUser}>Login</Button>)}
                </Form>
            </div>
        </div>
    )
}

export default Login