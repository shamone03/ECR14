import React, {useEffect, useState} from 'react'
import {Button, Modal} from "react-bootstrap";
import styles from '../css/Nominate.module.css'
import {url} from "../assets/js/url";
import {AiOutlineClose} from "react-icons/all";

const Nominate = () => {
    const [allPolls, setAllPolls] = useState([])
    const [blockPolls, setBlockPolls] = useState([])
    const [chosenPoll, setChosenPoll] = useState('')
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const getPolls = async () => {
            const res = await fetch(`${url}/api/getPolls`, {
                method: 'GET',
                credentials: 'include',
                headers: {"Content-Type": "application/json"},
            })

            if (res.status === 200) {
                const data = await res.json()
                setAllPolls(data.userPolls.filter(p => p.forBlock === 'all'))
                setBlockPolls(data.userPolls.filter(p => p.forBlock !== 'all'))
            }
        }
        getPolls().then()
    }, [])

    const BlockPolls = () => {
        return (
            <div className={'container'}>
                {blockPolls.map((p) => (
                    <div onClick={() => {
                        setChosenPoll(p._id)
                        setShowModal(true)
                    }} className={`row justify-content-lg-center mb-2 ${styles.pollStyle}`} key={p._id}>
                        <div className={'col-auto'}>
                            <h2>{p.position.toUpperCase()}</h2>
                            <p style={{wordWrap: 'break-word'}}>{p.description}</p>
                        </div>
                    </div>

                ))}
            </div>

        )
    }

    const AllPolls = () => {
        return (
            <div className={'container'}>
                {allPolls.map((p) => (
                    <div onClick={() => {
                        setChosenPoll(p._id)
                        setShowModal(true)
                    }} className={`row justify-content-lg-center mb-2 ${styles.pollStyle}`} key={p._id}>
                        <div className={'col-auto'}>
                            <h2>{p.position.toUpperCase()}</h2>
                            <p style={{wordWrap: 'break-word'}}>{p.description}</p>
                        </div>
                    </div>

                ))}
            </div>

        )
    }

    return (
        <>
            <h1 className={'text-center mt-5'}>Nominate Yourself</h1>
            <div className={'w-75 mx-auto'}>
                <div className={'container mx-auto'}>
                    <div className={'row justify-content-center'}>
                        <div className={'col-auto'}>
                            <h1 className={'text-center'}>Polls for your block</h1>
                            <BlockPolls/>
                        </div>
                        <div className={'col-auto'}>
                            <h1 className={'text-center'}>Polls for all blocks</h1>
                            <AllPolls/>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} fullscreen onHide={() => setShowModal(false)} contentClassName={styles.nominateModal}>
                <Modal.Header className={'d-flex justify-content-between'}>
                    <Modal.Title>Enter Your details</Modal.Title>
                    <Button variant={`outline-light ${styles.closeButtonStyle}`} onClick={() => setShowModal(false)}><AiOutlineClose size={25}/></Button>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
            </Modal>

        </>

    )
}

export default Nominate