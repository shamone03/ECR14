import {useState} from "react";
import React from 'react';
const Login = () => {
    const [houseNo, setHouseNo] = useState('')
    const [password, setPassword] = useState('')

    const loginUser = async (e) => {
        e.preventDefault()
        const res = await fetch(`http://localhost:8080/api/login`, {
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
        } else {
            alert('invalid houseNo or password')
        }
    }

    return (
        <>
            <h1 className="text-center" id="login-heading">Login</h1>
            <div>
                <small>House number</small>
                <input type="text" onChange={e => setHouseNo(e.target.value)}/>
                <small>Password</small>
                <input type="password" onChange={e => setPassword(e.target.value)}/>
                <button onClick={loginUser}>Login</button>
            </div>
        </>



    )
}

export default Login