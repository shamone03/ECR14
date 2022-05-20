import {useState} from "react";
import React from 'react';
import {Button, Card, Form} from "react-bootstrap";
import {Navigate} from "react-router-dom";
const Login = () => {
    const [houseNo, setHouseNo] = useState('')
    const [password, setPassword] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)

    const loginUser = async (e) => {
        e.preventDefault()
        const res = await fetch(`https://ecr14.org/api/login`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "houseNo": houseNo,
                "password": password
            })
        })
        if (res.status === 200) {
            const data = await res.json()
            localStorage.setItem('token', data.token)
            setLoggedIn(true)
        } else {
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
        // <>
        //     <h1 className="text-center" id="login-heading">Login</h1>
        //     <div>
        //         <small>House number</small>
        //         <input type="text" onChange={e => setHouseNo(e.target.value)}/>
        //         <small>Password</small>
        //         <input type="password" onChange={e => setPassword(e.target.value)}/>
        //         <Button variant={"outline-dark"} onClick={loginUser}>Login</Button>{' '}
        //     </div>
        // </>
        <>
            <RedirectHome/>
            <div style={{height: "300px"}}>
                <Form className={"mx-auto d-flex flex-column justify-content-between align-items-center"}>
                    <h1>ECR14</h1>
                    <Form.Group className={"mb-3 mt-5" }>
                        <Form.Label>Enter Apartment Number</Form.Label>
                        <Form.Control type={"text"} placeholder={"example: J606"} onChange={e => setHouseNo(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={"mb-3"}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Button variant={"outline-dark"} onClick={loginUser}>Submit</Button>

                </Form>
            </div>
        </>



    )
}

export default Login