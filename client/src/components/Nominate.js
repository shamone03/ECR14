import React, {useEffect, useState} from 'react'
import {Button, Form, Modal} from "react-bootstrap";
import styles from '../css/Nominate.module.css'
import inputStyle from '../css/InputText.module.css'
import {url} from "../assets/js/url";
import {AiOutlineClose} from "react-icons/all";
import CropPicture from "./CropPicture";
import LoadingButton from "./LoadingButton";

const Nominate = () => {
    const [allPolls, setAllPolls] = useState([])

    const [chosenPoll, setChosenPoll] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [imgB64, setImgB64] = useState('')
    const [imgFile, setImgFile] = useState(new File([], "", undefined))
    const [loading, setLoading] = useState(false)

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
            }
        }
        getPolls().then()
    }, [])

    const addNominee = async () => {

        setLoading(true)
        const res = await fetch(`${url}/api/addNominee`, {
            method: 'POST',
            credentials: 'include',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: name,
                description: desc,
                pollId: chosenPoll._id,
                imgBase64: imgB64 ? imgB64.split(',')[1] : ''
            })
        })

        if (res.status === 200) {
            setLoading(false)
            alert('You have been signed up!')
        }
        if (res.status === 400) {
            setLoading(false)
            alert('You have already signed up for this position')
        }
        setLoading(false)

    }


    const AllPolls = () => {
        return (
            allPolls.map((p) => (
                <div onClick={() => {
                    setChosenPoll(p)
                    setShowModal(true)
                }} className={`px-3 py-3 ${styles.pollStyle}`} key={p._id}>
                    <div>
                        <h2>{p.position.toUpperCase()}</h2>
                        <p style={{wordWrap: 'break-word'}}>{p.description.substring(0, Math.min(p.description.length, 50)) + '...'}</p>
                    </div>
                </div>
            ))

        )
    }

    return (
        <>
            <h1 className={'text-center my-5'}>Nominate Yourself</h1>
            <div className={'w-75 mx-auto'}>
                <div className={`${styles.allPollsWrapper} mb-5`}>
                    <AllPolls/>
                </div>
            </div>
            <Modal show={showModal} fullscreen onHide={() => setShowModal(false)} contentClassName={styles.modal}>
                <Modal.Header className={'d-flex justify-content-between'}>
                    <Modal.Title>Enter Your details</Modal.Title>
                    <Button variant={`outline-light ${styles.closeButtonStyle}`} onClick={() => setShowModal(false)}><AiOutlineClose size={25}/></Button>
                </Modal.Header>
                <Modal.Body>

                    <h1 className={'text-center'}>Nominating for {chosenPoll.position}</h1>
                    <p className={'text-center'} style={{wordWrap: 'break-word'}}>{chosenPoll.description}</p>
                    <Form className={'container mx-auto'}>

                        <CropPicture defaultImg={''} setImgB64={setImgB64} imgB64={imgB64} imgFile={imgFile}/>
                        <Form.Group controlId="formFile" className={'mb-3 row justify-content-center'}>
                            <Form.Label>Upload display picture</Form.Label>
                            <Form.Control type="file" accept={'image/*'} className={inputStyle.inputStyle} onChange={(e) => {
                                e.target.files.length > 0 ? setImgFile(e.target.files[0]) : setImgFile(file => file)
                            }}/>
                        </Form.Group>
                        <Form.Group className={'mb-3 row justify-content-center'}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control onChange={(e) => setName(e.target.value)} className={`${inputStyle.inputStyle}`} type={'text'} placeholder={'Enter your name'}/>
                        </Form.Group>
                        <Form.Group className={'mb-3 row justify-content-center'}>
                            <Form.Label>Description</Form.Label>
                            <Form.Control onChange={(e) => setDesc(e.target.value)} className={`${inputStyle.inputStyle}`} type={'text'} as={'textarea'} placeholder={'Why do you want to run for this position?'}/>
                        </Form.Group>
                        <Form.Group className={'mb-3 row justify-content-center'}>
                            <LoadingButton className={'mb-5 text-center col-lg-3'} type={'submit'} onClick={addNominee} loading={loading} variant={'outline-success'} text={`Run for position`}/>
                        </Form.Group>

                    </Form>


                </Modal.Body>
            </Modal>

        </>

    )
}

export default Nominate