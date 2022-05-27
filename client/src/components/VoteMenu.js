import React, {useState} from 'react'
import VotingCard from "./VotingCard";
import {Link} from "react-router-dom";
const VoteMenu = () => {
    return (
        <>
            <div className={'vh-100 d-flex flex-column align-items-center justify-content-center'}>
                <div className="list-group w-50 mx-auto text-center">
                    <Link to={'/construction'} className={'list-group-item list-group-item-action list-group-item-dark'}>Nominate Yourself</Link>
                    <Link to={'/vote/vote-now'} className={'list-group-item list-group-item-action list-group-item-dark'}>Vote Now</Link>
                </div>
            </div>
        </>

    )
}

export default VoteMenu