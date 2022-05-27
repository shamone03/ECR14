import React, {useEffect, useState} from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import {url} from "../assets/js/url";



const VerifyEmailLink = () => {
    const [validURL, setValidURL] = useState(false)
    const params = useParams()

    useEffect(() => {
        const verifyEmailLink = async () => {
            try {
                const res = await fetch(`http://${url}/api/${params.id}/verify/${params.token}`, {
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
            } catch (e) {
                console.log('invalid link')
                setValidURL(false)
            }
        }
        verifyEmailLink()
    }, [params])

    return (
        <>
            {validURL ? (
                <>
                    <Navigate to={'/login'}/>
                </>
            ) : (
                <h1>invalid link</h1>
            )}
        </>

    )
}

export default VerifyEmailLink