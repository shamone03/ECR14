import React, {useEffect, useState} from 'react'
import VotingCard from "./VotingCard";
import {url} from "../assets/js/url";
import {Button, Modal, Offcanvas, Spinner} from "react-bootstrap";
import styles from "../css/Voting.module.css";
import {AiOutlineClose} from "react-icons/all";
import LoadingButton from "./LoadingButton";


const Voting = () => {
    const [nominees, setNominees] = useState([])
    const [polls, setPolls] = useState([])
    const [chosenPoll, setChosenPoll] = useState('')
    const [chosenNoms, setChosenNoms] = useState([])
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [fullScreen, setFullScreen] = useState(true)

    useEffect(() => {
        const fetchPolls = async () => {
            const res = await fetch(`${url}/api/getPolls`, {
                method: 'GET',
                headers: {
                    "Authorization": localStorage.getItem('token'),
                    "Content-Type": "application/json"
                }
            })
            if (res.status === 200) {
                const data = await res.json()
                setPolls([...data.userPolls])
            }
        }
        const fetchNominees = async () => {
            const res = await fetch(`${url}/api/getNominees`, {
                method: 'GET',
                headers: {
                    "Authorization": localStorage.getItem('token'),
                    "Content-Type": "application/json"
                }
            })
            if (res.status === 200) {
                const data = await res.json()
                setNominees([...data.userNominees])
            }
        }
        setLoading(true)
        fetchPolls()
        fetchNominees()
        setLoading(false)

    }, [])


    const sendVote = async () => {
        const res = await fetch(`${url}/api/vote`, {
            method: 'POST',
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nomineeIds: chosenNoms.map(i => ({_id: i._id}))
            })
        })
        if (res.status === 400) {
            alert('Server error try again later')
            return
        }
        if (res.status === 500) {
            alert('Server error try again later')
            return
        }
        if (res.status === 200) {
            alert('Voted Successfully')
        }
    }


    const handleShow = (poll) => {
        setChosenPoll(poll)
        clearChosenNoms()
        setShowModal(true)
    }

    const addNom = (i) => {
        setChosenNoms([...chosenNoms, i])
    }

    const clearChosenNoms = () => {
        setChosenNoms([])
    }

    const chosenNomsContains = (_id) => {
        for (let i of chosenNoms) {
            if (i._id === _id) {

                return false
            }
        }
    }

    const Nominees = ({chosenPoll}) => {
        let nomineesCopy = nominees
        nomineesCopy = nomineesCopy.filter((i) => i.poll._id === chosenPoll._id)
        if (chosenNoms.length > 0) {
            nomineesCopy = nomineesCopy.filter((i) => {
                return !chosenNoms.find((j => {
                    return j._id === i._id
                }))
            })

        }
        return (
            // nomineesCopy.map(i => (<li onClick={() => addNom(i)} className={'text-center list-group-item list-group-item-action list-group-item-dark'} key={i._id}>{i.name}</li>))
            nomineesCopy.map(i => (<VotingCard addNom={addNom} key={i._id} nom={i}/>))
        )
    }

    const ChosenNoms = () => {
        return (
            chosenNoms.map(i => (<VotingCard addNom={addNom} key={i._id} nom={i}/>))
        )
    }


    return (
        <>
            <div>

                <h1 className={'text-center'}>Vote</h1>
                <div className={'container'}>
                    <h1 className={'text-center'}>Choose position to vote for</h1>
                    <div className={'row align-items-center'}>

                        <ul className={'list-group mt-2 text-center w-100'}>
                            {polls.map(i => (<li onClick={() => handleShow(i)} className={'text-center list-group-item list-group-item-action list-group-item-dark'} key={i._id}>{i.position}</li>))}
                        </ul>

                    </div>
                </div>
            </div>
            <Modal show={showModal} fullscreen={fullScreen} onHide={() => setShowModal(false)} contentClassName={styles.votingModal}>
                <Modal.Header className={'d-flex justify-content-between'} closeVariant={'white'} style={{border: 'none'}}>
                    <Modal.Title>Voting for {chosenPoll.position}</Modal.Title>
                    <Button variant={`outline-light ${styles.closeButtonStyle}`} onClick={() => setShowModal(false)}><AiOutlineClose size={25}/></Button>
                </Modal.Header>
                <Modal.Body>
                    <div className={'container'}>
                        <div className={'row'}>
                            <ChosenNoms/>
                        </div>
                        <LoadingButton variant={'outline-light'} className={'my-5'} loading={loading} onClick={sendVote} text={'Submit Vote'}/>
                        <h1 className={'text-center'}>Nominees</h1>

                        <h2 className={'text-center'}>Choose {chosenPoll.representatives} representatives</h2>
                        <div className={'row'}>
                            <Nominees chosenPoll={chosenPoll}/>
                        </div>

                        {/*{nominees.map(i => (<VotingCard key={i._id} name={i.name} _id={i._id} votes={i.votes} description={i.description} reps={i.poll.representatives} sendVote={sendVote}/>))}*/}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Voting