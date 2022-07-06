import React, {useEffect, useState} from 'react'
import {Button, Form, Modal} from "react-bootstrap";
import styles from '../../css/PollStyles.module.css'
import inputStyle from '../../css/InputText.module.css'
import {url} from "../../assets/js/url";
import {AiOutlineClose} from "react-icons/ai";
import CropPicture from "../utils/CropPicture";
import LoadingButton from "../utils/LoadingButton";
import {useNavigate} from "react-router-dom";
import {toast} from 'react-toastify'

const Nominate = () => {
    const validStyle = {border: '3px #161b22 solid'}
    const invalidStyle = {border: '3px red solid'}

    const [allPolls, setAllPolls] = useState([])
    const [chosenPoll, setChosenPoll] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [bio, setBio] = useState('')
    const [imgB64, setImgB64] = useState('')
    const [imgFile, setImgFile] = useState(new File([], "", undefined))
    const [loading, setLoading] = useState(false)
    const [picStyle, setPicStyle] = useState(validStyle)
    const [nameStyle, setNameStyle] = useState(validStyle)
    const [descStyle, setDescStyle] = useState(validStyle)
    const [bioStyle, setBioStyle] = useState(validStyle)
    const navigate = useNavigate()

    const validatePic = (imgB64) => {
        if (imgB64 !== '') {
            setPicStyle(validStyle)
            return true
        } else {
            setPicStyle(invalidStyle)
            return false
        }
    }

    const validateName = (name) => {
        setName(name)
        if (name.length < 3) {
            setNameStyle(invalidStyle)
            return false
        }
        setNameStyle(validStyle)
        return true
    }

    const validateDesc = (desc) => {
        setDesc(desc)
        // check word count
        // split on one or more spaces
        if (desc.split(/\s+/).length < 50) {
            setDescStyle(invalidStyle)
            return false
        }
        setDescStyle(validStyle)
        return true
    }

    const validateBio = (bio) => {
        setBio(bio)
        if (bio.split(/\s+/).length < 10) {
            setBioStyle(invalidStyle)
            return false
        }
        setBioStyle(validStyle)
        return true
    }

    useEffect(() => {
        setPicStyle(validStyle)
    }, [imgFile])

    const validate = () => {
        if (!validatePic(imgB64)) {
            setPicStyle(invalidStyle)
            alert('Upload a picture of yourself to continue')
            return false
        } else {
            setPicStyle(validStyle)
        }
        if (!validateName(name)) {
            setNameStyle(invalidStyle)
            alert('Name has to be 3 characters long')
            return false
        } else {
            setNameStyle(validStyle)
        }
        if (!validateDesc(desc)) {
            setDescStyle(invalidStyle)
            alert('Description has to be at least 50 words')
            return false
        } else {
            setDescStyle(validStyle)
        }
        if (!validateBio(bio)) {
            setBioStyle(invalidStyle)
            alert('Bio has to be at least 10 words')
            return false
        } else {
            setBioStyle(validStyle)
        }
        return true
    }

    const handleHide = () => {
        setName('')
        setDesc('')
        setBio('')
        setChosenPoll('')
        setImgFile(new File([], "", undefined))
        setImgB64('')
        setShowModal(false)
    }

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
        if (!validate()) {
            return
        }
        setLoading(true)
        const res = await fetch(`${url}/api/addNominee`, {
            method: 'POST',
            credentials: 'include',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: name,
                description: desc,
                pollId: chosenPoll._id,
                bio: bio,
                imgBase64: imgB64 ? imgB64.split(',')[1] : ''
            })
        })

        setLoading(false)
        if (res.status === 200) {
            toast('You are now running for this position', {
                theme: "colored",
                hideProgressBar: true,
                type: "success",
                draggable: true,
                autoClose: 3000
            })
        }
        if (res.status === 400) {
            toast('You have already signed up for this position', {
                theme: 'colored',
                hideProgressBar: true,
                type: 'error',
                draggable: true,
                autoClose: 3000
            })
        }
        if (res.status === 401) {
            if (window.confirm('Verify your email from the profile page to run for this position')) {
                navigate('/profile')
            }
        }


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
            <div className={'container'}>
                <h1 className={'text-center mb-3'}>Choose position to run for</h1>
                <div className={`${styles.allPollsWrapper} mb-5`}>
                    <AllPolls/>
                </div>
            </div>
            <Modal show={showModal} fullscreen onHide={handleHide} contentClassName={styles.modal}>
                <Modal.Header className={`d-flex justify-content-between ${styles.modalHeader}`}>
                    <Modal.Title>Enter Your details</Modal.Title>
                    <Button variant={`outline-light ${styles.closeButtonStyle}`} onClick={handleHide}><AiOutlineClose size={25}/></Button>
                </Modal.Header>
                <Modal.Body>

                    <h1 className={'text-center'}>Nominating for {chosenPoll.position}</h1>
                    <p className={'text-center'} style={{wordWrap: 'break-word'}}>{chosenPoll.description}</p>
                    <Form className={'container mx-auto'} onSubmit={e => e.preventDefault()}>

                        <CropPicture defaultImg={''} setImgB64={setImgB64} imgB64={imgB64} imgFile={imgFile}/>
                        <Form.Group className={'mb-3 row justify-content-center'}>
                            <div className={'col-md-6'}>
                                <Form.Label>Upload display picture</Form.Label>
                                <Form.Control type="file" accept={'image/*'} style={picStyle} className={inputStyle.inputStyle} onChange={e => e.target.files.length > 0 ? setImgFile(e.target.files[0]) : setImgFile(file => file)}/>
                            </div>

                        </Form.Group>
                        <Form.Group className={'mb-3 row justify-content-center'}>
                            <div className={'col-md-6'}>
                                <Form.Label>Name</Form.Label>
                                <Form.Control style={nameStyle} onChange={(e) => validateName(e.target.value)} className={`${inputStyle.inputStyle}`} type={'text'} placeholder={'Enter your name'}/>
                            </div>
                        </Form.Group>
                        <Form.Group className={'mb-3 row justify-content-center'}>
                            <div className={'col-md-6'}>
                                <Form.Label>Biography</Form.Label>
                                <Form.Control style={bioStyle} onChange={(e) => validateBio(e.target.value)} className={`${inputStyle.inputStyle}`} type={'text'} as={'textarea'} placeholder={'Who are you?'}/>
                            </div>

                        </Form.Group>
                        <Form.Group className={'mb-3 row justify-content-center'}>
                            <div className={'col-md-6'}>
                                <Form.Label>Description</Form.Label>
                                <Form.Control style={{...descStyle, height: '120px'}} onChange={(e) => validateDesc(e.target.value)} className={`${inputStyle.inputStyle}`} type={'text'} as={'textarea'} placeholder={'Why do you want to run for this position? \nWhy are you the best for this position? \nWhat do you promise to do in this position?'}/>
                            </div>

                        </Form.Group>
                        <Form.Group className={'mb-3 row justify-content-center'}>
                            <LoadingButton className={'mb-5 text-center col-md-3'} type={'submit'} onClick={addNominee} loading={loading} variant={'outline-success'} text={`Run for position`}/>
                        </Form.Group>

                    </Form>


                </Modal.Body>
            </Modal>

        </>

    )
}

export default Nominate