import React, {useEffect, useState} from 'react'
import {Button, Image} from "react-bootstrap";
import RedirectLogin from "./RedirectLogin";
import {url} from "../assets/js/url";
import {useNavigate} from "react-router-dom";
import {AiOutlineClose, AiOutlineEdit, FiLogOut, MdVerified} from "react-icons/all";
import UpdateUser from "./UpdateUser";
import LoadingButton from "./LoadingButton";


const Settings = () => {
    const [houseNo, setHouseNo] = useState('')
    const [members, setMembers] = useState([])
    const [showMembers, setShowMembers] = useState(false)
    const [verified, setVerified] = useState(false)
    const [loggedIn, setLoggedIn] = useState(true)
    const [residentType, setResidentType] = useState('')
    const [number, setNumber] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
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

    const resetPassword = async () => {
        setPasswordLoading(true)
        const res = await fetch(`${url}/api/resetPassword`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                houseNo: houseNo
            })
        })
        if (res.status === 200) {
            setPasswordLoading(false)
            alert('Click link sent to your registered email to set password')
        } else {
            setPasswordLoading(false)
            alert('Server error')
        }

    }

    const logout = () => {
        localStorage.clear()
        navigate('/')
    }


    const Names = () => {

            return (
                // <ul className={'list-group mx-auto mt-2 text-center w-100'}>
                //     {members.map(i => <li className={'text-center list-group-item list-group-item-action list-group-item-dark'} key={i._id}>{i.name}</li>)}
                // </ul>
                <div className={'container'}>
                    <div className={'row justify-content-center'} >
                        <h6 className={'col-lg-2 col-5 text-start p-1'} style={{borderBottom: '1px solid gray', color: 'lightblue'}}>Name</h6>
                        <h6 className={'col-lg-2 col-5 text-end p-1'} style={{borderBottom: '1px solid gray', color: 'lightblue'}}>Age</h6>
                    </div>
                    {members.map(i => (
                        <div className={'row justify-content-center'} style={{wordWrap: 'break-word'}} key={i._id}>
                            <h6 className={'col-lg-2 col-5 text-start'} style={{color: 'lightblue'}}>{i.name}</h6>
                            <h6 className={'col-lg-2 col-5 text-end'}>{i.age}</h6>
                        </div>
                    ))}
                </div>
            )


    }

    return (
        <>
            <RedirectLogin loggedIn={loggedIn}/>
            <div className={'mx-auto d-flex align-items-center justify-content-center flex-column'} style={{width: '75%'}}>
            {editMode ? (
                <>
                    <div className={'d-flex w-100 justify-content-end'}>
                        <Button variant={'outline-warning'} className={'mt-3'} onClick={() => setEditMode(false)}><AiOutlineClose size={20}/></Button>
                    </div>
                    <UpdateUser img={img} members1={members} number1={number} resType={residentType}/>
                </>
            ) : (
                <>
                    <div className={'d-flex w-100 justify-content-end'}>
                        <Button variant={'outline-warning'} className={'mt-3'} onClick={() => setEditMode(true)}><AiOutlineEdit size={20}/></Button>
                    </div>
                    {img !== '' ? <Image roundedCircle width={150} height={150} src={img}/> : <></>}

                    <h1 className={'text-center'}>{houseNo}</h1>
                    <div className={'container my-2'}>
                        <div className={'row justify-content-center'} style={{wordWrap: 'break-word'}}>
                            <h5 className={'col-md-3 text-start'} style={{color:'lightblue'}}>Email{verified ? (<span><MdVerified color={'green'} size={20}/></span>) : (<span><MdVerified color={'gray'} size={20}/></span>)}: </h5>
                            <h5 className={'col-md-3 text-lg-end'}>{email}</h5>
                        </div>
                        <div className={'row justify-content-center'} style={{wordWrap: 'break-word'}}>
                            <h5 className={'col-md-3 text-start'} style={{color:'lightblue'}}>Number: </h5>
                            <h5 className={'col-md-3 text-lg-end'}>{number}</h5>
                        </div>
                        <div className={'row justify-content-center'} style={{wordWrap: 'break-word'}}>
                            <h5 className={'col-md-3 text-start'} style={{color:'lightblue'}}>Resident Type: </h5>
                            <h5 className={'col-md-3 text-lg-end'}>{residentType}</h5>
                        </div>
                    </div>
                    {/*<Button variant={'dark'} className={'mt-5 mx-auto'} onClick={() => setShowMembers(!showMembers)}>Show residents</Button>*/}
                    <Names/>
                    <div className={'my-3 text-center'}>
                        {verified ? '': (<div><LoadingButton variant={'outline-light'} onClick={sendEmail} text={'Resend Verification Email'} loading={loading}/></div> )}
                        <LoadingButton variant={'outline-light'} className={'mt-3'} onClick={resetPassword} text={'Reset Password'} loading={passwordLoading}/>
                    </div>
                    <Button className={'my-3'} variant={'outline-danger'} onClick={logout}>Logout &nbsp;<FiLogOut size={'25'}/></Button>
                </>
            )}
            </div>

        </>
    )
}

export default Settings