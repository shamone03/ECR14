import React from 'react'
import {Navigate} from "react-router-dom";

const RedirectLogin = ({loggedIn}) => {
    return (
        <>
            {!loggedIn ? (<Navigate to={'/login'}/>) : ('')}
        </>
    )
}

export default RedirectLogin