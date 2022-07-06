import {useEffect, useState} from "react";
import React from 'react';
import {Form, Spinner} from "react-bootstrap";
import {Navigate} from "react-router-dom";
import styles from '../css/Login.module.css'
import {url} from "../assets/js/url";
import LoadingButton from "./utils/LoadingButton";

const Login = () => {
    const [houseNo, setHouseNo] = useState('')
    const [password, setPassword] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${url}/api/getUser`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
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
            credentials: 'include',
            body: JSON.stringify({
                "houseNo": houseNo.charAt(0).toUpperCase() + houseNo.slice(1),
                "password": password
            })
        })
        if (res.status === 200) {
            setLoading(false)
            setLoggedIn(true)
        } else {
            setLoading(false)
            alert('invalid houseNo or password')
        }
    }

    const resetPassword = async (e) => {
        e.preventDefault()
        if (houseNo === '') {
            alert('Enter Apartment Number to reset password.')
            return
        }
        setPasswordLoading(true)
        const res = await fetch(`${url}/api/resetPassword`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            credentials: 'include',
            body: JSON.stringify({
                houseNo: houseNo.charAt(0).toUpperCase() + houseNo.slice(1)
            })
        })
        if (res.status === 200) {
            setPasswordLoading(false)
            alert('Click link sent to your registered email to set password')
        }
        if (res.status === 404) {
            setPasswordLoading(false)
            alert('Invalid Apartment Number')
        }
        if (res.status === 500) {
            setPasswordLoading(false)
            alert('Server error try again later')
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
            <h1 className={'text-center mt-3'}>Login</h1>
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
                    <LoadingButton variant={'outline-success'} className={'mt-5'} onClick={(e) => loginUser(e)} type={'submit'} text={'Login'} loading={loading}/>
                    {passwordLoading ? (
                        <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" style={{marginTop: '10px'}}/>
                    ) : (
                        <p onClick={(e) => resetPassword(e)} className={styles.linkStyle}>Forgot password?</p>
                    )}

                </Form>
            </div>
        </div>
    )
}

export default Login