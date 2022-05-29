import React, {useEffect, useState} from 'react'
import {Button} from "react-bootstrap";
import RedirectLogin from "./RedirectLogin";
import {url} from "../assets/js/url";


const Settings = () => {
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

    const Names = () => {
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

    return (
        <>
            <RedirectLogin loggedIn={loggedIn}/>
            <div className={'w-50 mx-auto'}>
                <Button variant={'dark'} className={'mx-auto'} onClick={() => setShowNames(!showNames)}>Show residents</Button>
                <Names/>
            </div>

            <div className={'mt-3 text-center'}>
                {verified ? (<h3>You are verified</h3>) : (<h3>You are not verified</h3>)}
            </div>
        </>
    )
}

export default Settings