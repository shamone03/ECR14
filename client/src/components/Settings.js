import React, {useEffect, useState} from 'react'
import {Button, Spinner} from "react-bootstrap";
import RedirectLogin from "./RedirectLogin";
import {url} from "../assets/js/url";


const Settings = () => {
    const [houseNo, setHouseNo] = useState('')
    const [names, setNames] = useState([])
    const [verified, setVerified] = useState(false)
    const [showNames, setShowNames] = useState(false)
    const [loggedIn, setLoggedIn] = useState(true)
    const [showMenu, setShowMenu] = useState(false)
    const [residentType, setResidentType] = useState('')
    const [number, setNumber] = useState('')
    const [email, setEmail] = useState('')
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
                const data = await res.json()
                console.log(data)
                setVerified(data.verified)
                setLoggedIn(true)
                setHouseNo(data.houseNo)
                setNames(data.names)
                setResidentType(data.residentType)
                setNumber(data.number)
                setEmail(data.email)
            }
        }
        fetchData()
    }, [])

    const sendEmail = async () => {
        setLoading(true)
        const res = await fetch(`${url}/api/verifyEmail`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            }
        })
        if (res.status === 200) {
            setLoading(false)
            alert('Click the link on your email to verify')
        } else {
            setLoading(false)
            alert('Server error try again later')
        }
    }

    const Names = () => {
        if (showNames) {
            return (
                <ul className={'list-group mx-auto mt-2 text-center w-100'}>
                    {names.map(i => <li className={'text-center list-group-item list-group-item-action list-group-item-dark'} key={i._id}>{i.name}</li>)}
                </ul>
            )
        } else {
            return (
                <></>
            )
        }

    }

    const LoadingButton = ({loading, text, onClick}) => {
        if (loading) {
            return (
                <Button className={'mt-5'} variant="outline-light" disabled>
                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                    Loading...
                </Button>
            )
        }
        if (!loading) {
            return (
                <Button onClick={onClick} className={'mt-5'} variant={'outline-light'}>{text}</Button>
            )
        }
    }

    return (
        <>
            <RedirectLogin loggedIn={loggedIn}/>
            <div className={'w-50 mx-auto d-flex align-items-center justify-content-center flex-column'}>
                <Button variant={'dark'} className={'mt-5 mx-auto'} onClick={() => setShowNames(!showNames)}>Show residents</Button>
                <Names/>
                <p className={'mt-5'}>
                    <strong>Resident Type: </strong>{residentType} <br/><br/>
                    <strong>Number: </strong>{number} <br/><br/>
                    <strong>Email: </strong>{email}
                </p>
            </div>

            <div className={'mt-3 text-center'}>
                {verified ? (<h3>You are verified</h3>) : (<LoadingButton onClick={sendEmail} text={'Resend Verification Email'} loading={loading}/> )}
            </div>
        </>
    )
}

export default Settings