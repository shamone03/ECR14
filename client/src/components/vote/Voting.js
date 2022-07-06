import React, {useEffect, useState} from 'react'
import VotingCard from "./VotingCard";
import {url} from "../../assets/js/url";
import {Button, Modal} from "react-bootstrap";
import styles from "../../css/PollStyles.module.css";
import {AiOutlineClose} from "react-icons/ai";
import LoadingButton from "../utils/LoadingButton";
import DisplayPolls from "./DisplayPolls";
import {toast} from 'react-toastify'


const Voting = () => {
    const [nominees, setNominees] = useState([])
    const [polls, setPolls] = useState([])
    const [chosenPoll, setChosenPoll] = useState('')
    const [chosenNoms, setChosenNoms] = useState([])
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const fetchPolls = async () => {
            const res = await fetch(`${url}/api/getPolls`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.status === 200) {
                const data = await res.json()
                setPolls([...data.userPolls.filter(p => p.forBlock === 'all')])
            }
        }
        const fetchNominees = async () => {
            const res = await fetch(`${url}/api/getNominees`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.status === 200) {
                const data = await res.json()
                setNominees([...data.userNominees])
            }
        }
        setLoading(true)
        fetchPolls().then()
        fetchNominees().then()
        setLoading(false)

    }, [])

    const validateChosen = () => {
        return chosenNoms.length === chosenPoll.representatives
    }

    const sendVote = async () => {
        if (!validateChosen()) {
            toast(`Choose ${chosenPoll.representatives} representatives`, {
                theme: "colored",
                hideProgressBar: true,
                type: "error",
                draggable: true,
                autoClose: 3000
            })
            return
        }
        setLoading(true)
        const res = await fetch(`${url}/api/vote`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nomineeIds: chosenNoms.map(i => ({_id: i._id}))
            })
        })
        setLoading(false)
        if (res.status === 401) {
            toast('Verify your email from the profile page to vote', {
                theme: "colored",
                hideProgressBar: true,
                type: "error",
                draggable: true,
                autoClose: 3000
            })
            return
        }
        if (res.status === 400) {
            toast('You have already voted for this poll', {
                theme: "colored",
                hideProgressBar: true,
                type: "error",
                draggable: true,
                autoClose: 3000
            })
            return
        }
        if (res.status === 500) {
            toast('Server error try again later', {
                theme: "colored",
                hideProgressBar: true,
                type: "error",
                draggable: true,
                autoClose: 3000
            })
            return
        }
        if (res.status === 200) {
            toast('Voted Successfully', {
                theme: "colored",
                hideProgressBar: true,
                type: "success",
                draggable: true,
                autoClose: 3000
            })
        }
    }

    const addNom = (nom) => {
        setChosenNoms([...chosenNoms, nom])
    }

    const removeNom = (nom) => {
        setChosenNoms([...chosenNoms.filter((i) => i._id !== nom._id)])
    }

    const Nominees = ({chosenPoll}) => {
        let nomsForPoll = nominees.filter((i) => i.poll._id === chosenPoll._id)
        // if user has chosen a nom remove it from nomsForPoll
        if (chosenNoms.length > 0) {
            nomsForPoll = nomsForPoll.filter((i) => {
                return !chosenNoms.find((j => {
                    return j._id === i._id
                }))
            })
        }
        return (
            nomsForPoll.map(i => (<VotingCard addNom={addNom} key={i._id} nom={i} disabled={false}/>))
        )
    }

    const ChosenNoms = () => {
        return (
            chosenNoms.map(i => (<VotingCard addNom={addNom} key={i._id} nom={i} disabled={true} removeNom={removeNom}/>))
        )
    }

    const pollClicked = (p) => {
        setChosenPoll(p)
        setShowModal(true)
    }

    const handleHide = () => {
        setChosenPoll('')
        setChosenNoms([])
        setShowModal(false)
    }

    return (
        <>
            <h1 className={'text-center my-5'}>Vote</h1>
            <div className={'container'}>
                <h1 className={'text-center mb-3'}>Choose position to vote for</h1>
                <DisplayPolls polls={polls} whenPollClicked={pollClicked}/>
            </div>
            <Modal show={showModal} fullscreen onHide={handleHide} contentClassName={styles.modal}>
                <Modal.Header className={`d-flex justify-content-between ${styles.modalHeader}`} closeVariant={'white'}>
                    <Modal.Title>Voting for {chosenPoll.position}</Modal.Title>
                    <Button variant={`outline-light ${styles.closeButtonStyle}`} onClick={handleHide}><AiOutlineClose size={25}/></Button>
                </Modal.Header>
                <Modal.Body>
                    <div className={'container'}>
                        <div className={'row g-3'}>
                            <ChosenNoms/>
                        </div>
                        <LoadingButton variant={'outline-light'} className={'my-5'} loading={loading} onClick={sendVote} text={'Submit Vote'}/>
                        <h1 className={'text-center'}>Nominees</h1>

                        <h2 className={'text-center'}>Choose {chosenPoll.representatives} representatives</h2>
                        <div className={'row g-3'}>
                            <Nominees chosenPoll={chosenPoll}/>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Voting