import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";

const VerifyEmailLink = () => {
    const [validURL, setValidURL] = useState(false)
    const params = useParams()

    useEffect(() => {
        const verifyEmailLink = async () => {
            try {
                const res = await fetch(`https://ecr14.org/api/${params.id}/verify/${params.token}`, {
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
                    <h1>verified</h1>
                    <Link to={'/login'}>login</Link>
                </>
            ) : (
                <h1>invalid link</h1>
            )}
        </>

    )
}

export default VerifyEmailLink