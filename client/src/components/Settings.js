import React, {useEffect, useState} from 'react'
import {Button, Image} from "react-bootstrap";
import RedirectLogin from "./RedirectLogin";
import {url} from "../assets/js/url";
import {useNavigate} from "react-router-dom";
import {AiOutlineClose, AiOutlineEdit, FiLogOut, MdVerified} from "react-icons/all";
import UpdateUser from "./UpdateUser";
import LoadingButton from "./LoadingButton";
import placeholder from "../assets/images/placeholder.webp";


const Settings = () => {
    const [houseNo, setHouseNo] = useState('')
    const [members, setMembers] = useState([])
    const [parkings, setParkings] = useState([])
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
                credentials: 'include',
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
                setVerified(data.verified)
                setLoggedIn(true)
                setHouseNo(data.houseNo)
                setMembers(data.names)
                setNumber(data.number)
                setEmail(data.email)
                setParkings(data.parkingNos)
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
            credentials: 'include',
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
            credentials: 'include',
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
        try {
            const res = fetch(`${url}/api/logout`, {
                method: 'GET',
                headers: {"Content-Type": "application/json"},
                credentials: 'include'
            })
            if (res.status === 200) {

            }
            if (res.status === 500) {
                alert('Error logging out')
                return
            }
        } catch (e) {
            alert('Error logging out')
            console.log(e)
            return
        }
        navigate('/')
    }


    const Names = () => {
            return (
                <div className={'container'}>
                    <div className={'row justify-content-center'} >
                        <h6 className={'col-lg-2 col-5 text-start p-1'} style={{borderBottom: '1px solid gray', color: 'lightblue'}}>Name</h6>
                        <h6 className={'col-lg-2 col-5 text-end p-1'} style={{borderBottom: '1px solid gray', color: 'lightblue'}}>Age</h6>
                    </div>
                    {members.map(i => (
                        <div className={'row justify-content-center'} style={{wordWrap: 'break-word'}} key={i._id}>
                            <h6 className={'col-lg-2 col-5 text-start'} style={{color: 'lightblue'}}>{i.name} ({i.residentType})</h6>
                            <h6 className={'col-lg-2 col-5 text-end'}>{i.age}</h6>
                        </div>
                    ))}
                </div>
            )
    }

    const Parking = () => {
        if (parkings.length === 0) {
            return (
                <>
                </>
            )
        }
        if (parkings.length === 1) {
            return (
                <div className={'container mt-2'}>
                    <div className={'row justify-content-center'} >
                        <h4 className={'col-lg-3 col-5 text-start'}>Parking Spot: </h4>
                        <h4 className={'col-lg-3 col-5 text-end'}>{parkings[0]}</h4>
                    </div>
                </div>
            )
        }
        return (
            <div className={'container mt-2'}>
                <h3 className={'text-center'}>Parking Spots</h3>
                {parkings.map(i => (
                    <div key={i} className={'row justify-content-center'}>
                        <h6 className={'col-3 text-center'}>{i}</h6>
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
                    <UpdateUser img={img} members1={members} number1={number} parkings={parkings}/>
                </>
            ) : (
                <>
                    <div className={'d-flex w-100 justify-content-end'}>
                        <Button variant={'outline-warning'} className={'mt-3'} onClick={() => setEditMode(true)}><AiOutlineEdit size={20}/></Button>
                    </div>
                    {img !== '' ? <Image roundedCircle width={150} height={150} src={img}/> : <Image src={placeholder} roundedCircle width={150} height={150} alt={'prof pic'}/>}

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
                    </div>
                    {/*<Button variant={'dark'} className={'mt-5 mx-auto'} onClick={() => setShowMembers(!showMembers)}>Show residents</Button>*/}
                    <Names/>
                    <Parking/>
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