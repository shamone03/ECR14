import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {url} from "../assets/js/url";
import {Button, Form, Spinner} from "react-bootstrap";
import styles from "../css/Login.module.css";

const ResetPassword = () => {
    const [validURL, setValidURL] = useState(true)
    const params = useParams()
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [passwordStyle, setPasswordStyle] = useState({border: '3px transparent'})
    const [loading, setLoading] = useState(false)

    let navigate = useNavigate()

    const resetPassword = async () => {
        if (validatePasswords(password, passwordConfirm) === 'match') {
            alert('Passwords do not match')
            return
        }
        if (validatePasswords(password, passwordConfirm) === 'short') {
            alert('Password has to be at least 8 characters')
            return
        }
        try {
            setLoading(true)
            const res = await fetch(`${url}/api/${params.id}/reset/${params.token}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: password
                })
            })
            if (res.status === 200) {
                const data = await res.json()
                console.log(data)
                setValidURL(true)
                setLoading(false)
                navigate('/login')
            }
        } catch (e) {
            console.log(e)
            setValidURL(false)
            setLoading(false)
            alert('Server error try again later')
        }
    }

    const validatePasswords = (password, passwordConfirm) => {
        setPassword(password)
        setPasswordConfirm(passwordConfirm)
        console.log(password)
        if (password.length < 8) {
            setPasswordStyle({border: 'solid 3px red'})
            // alert('Password is too short')
            return 'short'
        }
        if (password !== passwordConfirm) {
            setPasswordStyle({border: 'solid 3px red'})
            // alert('Passwords do not match')
            return 'match'
        }
        setPasswordStyle({border: '3px transparent'})
    }


    return (
        <>
            {validURL ? (
                <>

                    <div style={{marginTop: '10%'}} className={'mx-auto w-50'}>
                        <h1 className={'text-center'}>Enter new Password</h1>
                        <Form className={'d-flex flex-column justify-content-between align-items-center'}>
                            <Form.Group className={'mb-3 mt-5'}>
                                <Form.Label>Enter Password</Form.Label>
                                <Form.Control className={styles.inputStyle} style={passwordStyle} type={'password'} onChange={(e) => validatePasswords(e.target.value, passwordConfirm)}/>
                            </Form.Group>
                            <Form.Group className={'mb-4'}>
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control className={styles.inputStyle} style={passwordStyle} type={'password'} onChange={(e) => validatePasswords(password, e.target.value)}/>
                            </Form.Group>

                        </Form>
                    </div>
                    <div className={'d-flex justify-content-center'}>
                        {loading ? (
                                <>
                                    <Button variant="outline-light" disabled>
                                        <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                                        Loading...
                                    </Button>
                                </>) :
                            (<Button variant={'outline-light'} className={'mx-auto mt-5'} onClick={resetPassword}>Submit</Button>)}
                    </div>
                </>
            ) : (<></>)}

        </>

    )
}

export default ResetPassword