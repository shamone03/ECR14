import React, {useEffect, useState, useRef} from 'react'
import {Button, Form, Image, Spinner} from "react-bootstrap";
import RedirectLogin from "./RedirectLogin";
import {url} from "../assets/js/url";
import {Link, useNavigate} from "react-router-dom";
import {AiOutlineClose, AiOutlineEdit, FiLogOut} from "react-icons/all";
import styles from '../css/InputText.module.css'
import UpdateUser from "./UpdateUser";
import LoadingButton from "./LoadingButton";


const Settings = () => {
    const canvasRef = useRef(null)
    const imgRef = useRef(null)
    const [imgFile, setImgFile] = useState(new File([], "", undefined))
    const [imgB64, setImgB64] = useState('')
    const [houseNo, setHouseNo] = useState('')
    const [members, setMembers] = useState([])
    const [showMembers, setShowMembers] = useState(false)
    const [verified, setVerified] = useState(false)
    const [loggedIn, setLoggedIn] = useState(true)
    const [residentType, setResidentType] = useState('')
    const [number, setNumber] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [img, setImg] = useState('')
    const [editMode, setEditMode] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${url}/api/getUser`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token')
                }
            })
            if (res.status === 401) {
                setLoggedIn(false)
            }
            if (res.status === 200) {
                const data = await res.json()
                console.log(data)
                setVerified(data.verified)
                setLoggedIn(true)
                setHouseNo(data.houseNo)
                setMembers(data.names)
                setResidentType(data.residentType)
                setNumber(data.number)
                setEmail(data.email)
                if (data.imgURL) {
                    setImg(data.imgURL)
                }

            }
        }
        fetchData()
    }, [])

    const sendEmail = async () => {
        setLoading(true)
        const res = await fetch(`${url}/api/verifyEmail`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            }
        })
        if (res.status === 200) {
            setLoading(false)
            alert('Click the link on your email to verify')
        } else {
            setLoading(false)
            alert('Server error try again later')
        }
    }

    const logout = () => {
        localStorage.clear()
        navigate('/login')
    }


    const Names = () => {
        if (showMembers) {
            return (
                <ul className={'list-group mx-auto mt-2 text-center w-100'}>
                    {members.map(i => <li className={'text-center list-group-item list-group-item-action list-group-item-dark'} _id={i._id}>{i.name}</li>)}
                </ul>
            )
        } else {
            return (
                <></>
            )
        }

    }

    return (
        <>
            <RedirectLogin loggedIn={loggedIn}/>
            <div className={'w-50 mx-auto d-flex align-items-center justify-content-center flex-column'}>
            {editMode ? (
                <>
                    <UpdateUser img={img} members1={members} number1={number} resType={residentType}/>
                    <Button variant={'outline-light'} className={'mb-2'} onClick={() => setEditMode(false)}><AiOutlineEdit size={20}/></Button>
                </>
            ) : (
                <>
                    {img !== '' ? <Image roundedCircle width={150} height={150} src={img} className={'mt-3'}/> : <></>}
                    <Button variant={'dark'} className={'mt-5 mx-auto'} onClick={() => setShowMembers(!showMembers)}>Show residents</Button>
                    <Names/>
                    <p className={'mt-5'}>
                        <strong>Resident Type: </strong>{residentType} <br/><br/>
                        <strong>Number: </strong>{number} <br/><br/>
                        <strong>Email: </strong>{email}
                    </p>
                    <div className={'my-3 text-center'}>
                        {verified ? (<h3>You are verified</h3>) : (<LoadingButton onClick={sendEmail} text={'Resend Verification Email'} loading={loading}/> )}
                    </div>
                    <Button variant={'outline-light'} className={'mb-2'} onClick={() => setEditMode(true)}><AiOutlineEdit size={20}/></Button>
                    <Button variant={'outline-danger'} onClick={logout}>Logout &nbsp;<FiLogOut size={'25'}/></Button>
                </>
            )}
            </div>

        </>
    )
}

export default Settings