import React, {useEffect, useState} from "react";
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import {url} from "../assets/js/url";
import {Spinner} from "react-bootstrap";



const VerifyEmailLink = () => {
    const [validURL, setValidURL] = useState(Boolean)
    const [showMsg, setShowMsg] = useState(Boolean)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        const verifyEmailLink = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${url}/api/${params.id}/verify/${params.token}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                if (res.status === 200) {
                    const data = await res.json()
                    console.log(data)
                    setValidURL(true)
                }
                if (res.status === 400) {
                    setValidURL(false)
                }
            } catch (e) {
                console.log('invalid link')
                setValidURL(false)
            }
            setLoading(false)
        }
        verifyEmailLink()
    }, [params])

    useEffect(() => {
        if (validURL) {
            setShowMsg(false)
            navigate('/login')
        } else {
            setShowMsg(true)
        }
    }, [validURL])

    return (
        <>
            <div className={'vh-100 w-100 d-flex align-items-center justify-content-center'}>
                {loading ? (
                    <Spinner as="span" animation="grow" role="status"/>
                ) : (
                    showMsg ? (<h1>Expired Link</h1>) : (<></>)
                )}
            </div>
        </>
    )
}

export default VerifyEmailLink