import React, {useEffect, useState} from 'react'
import {Button, Form} from "react-bootstrap";
import styles from "../css/InputText.module.css";
import {AiOutlineClose} from "react-icons/all";
import validator from "validator/es";
import {url} from "../assets/js/url";
import LoadingButton from "./LoadingButton";
import CropPicture from "./CropPicture";


const UpdateUser = ({img, members1, number1, parkings}) => {
    const [imgFile, setImgFile] = useState(new File([], "", undefined))
    const [memberStyle, setMemberStyle] = useState({})
    const [numberStyle, setNumberStyle] = useState({})
    const [loading, setLoading] = useState(false)

    const [imgB64, setImgB64] = useState('')
    const [number, setNumber] = useState('')
    const [members, setMembers] = useState([])
    const [parkingNos, setParkingNos] = useState([])

    useEffect(() => {
        setMembers(members1)
        setNumber(number1)
        setParkingNos(parkings)
    }, [])

    const setNameAgeRes = (_id, name, age, res) => {
        let membersCopy = members
        for (let i of membersCopy) {
            if (i._id === _id) {
                i.name = name
                i.age = age
                i.residentType = res
            }
        }
        setMembers([...membersCopy])
    }

    const removeName = (_id) => {
        let newMembers = members.filter((i) => i._id !== _id)
        setMembers([...newMembers])
    }

    const addMember = () => {
        const membersCopy = members
        if (membersCopy.length === 0) {
            membersCopy.push({name: '', age: 0, _id: 1, residentType: 'Resident Type'})
            setMembers([...membersCopy])
            return
        }
        membersCopy.push({name: '', age: 0, residentType: 'Resident Type', _id: members[members.length - 1]._id + 1})
        setMembers([...membersCopy])
    }

    const editParkingSpot = (p, i) => {
        const copy = parkingNos
        copy[i] = parseInt(p)
        setParkingNos([...copy])
    }

    const addParking = () => {
        const copy = parkingNos
        copy.push(0)
        setParkingNos([...copy])
    }

    const removeParkingNo = (i) => {

        const copy = parkingNos
        copy.splice(i, 1)

        setParkingNos([...copy])

    }

    const validateParking = () => {
        if ((new Set(parkingNos)).size === parkingNos.length) {
            setParkingNos((p) => [...p.map(i => parseInt(i))])
            for (let i of parkingNos) {
                if (i < 0 || i > 999) {
                    alert('Parking Number has to be between 0 and 999')
                    return false
                }
            }
            return true
        } else {
            alert('Parking Numbers have to be unique')
            return false
        }
    }

    const validateMembers = (members) => {
        const types = ['Owner', 'Tenant', 'Co-Owner', 'Family']
        if (members.length === 0) {
            alert('Add at least one resident')
            return false
        }
        for (let i of members) {
            if (i.name.length < 3) {
                alert('Names have to be longer that 3 characters')
                return false
            }
            if (i.age < 0 || i.age > 100) {
                alert('Enter age between 0 and 100')
                return false
            }
            if (!types.includes) {
                alert('Choose Resident Type')
                return false
            }
        }
        return true
    }

    const validateNumber = (number) => {
        if (!validator.isMobilePhone(number)) {
            setNumberStyle({border: 'solid 3px red'})
            setNumber(number)
        } else {
            setNumberStyle({border: '3px transparent'})
            setNumber(number)
        }
        return validator.isMobilePhone(number)
    }

    const validate = () => {
        if (!validateParking()) {
            return false
        }
        if (!validateNumber(number)) {
            setNumberStyle({border: 'solid 3px red'})
            alert('Invalid Number')
            return false
        } else {
            setNumberStyle({border: '3px transparent'})
        }
        if (!validateMembers(members)) {
            setMemberStyle({border: 'solid 3px red'})
            return false
        } else {
            setMemberStyle({border: '3px transparent'})
        }
        return true
    }

    const update = async (e) => {
        e.preventDefault()
        if (!validate()) {
            return
        }
        setLoading(true)
        const res = await fetch(`${url}/api/update`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                names: members.map(i => ({name: i.name, age: parseInt(i.age), residentType: i.residentType})),
                number: number,
                imgBase64: imgB64 ? imgB64.split(',')[1] : '',
                parkingNos: parkingNos
            })
        })
        if (res.status === 200) {
            alert('Updated')
            setLoading(false)
            window.location.reload()
        }
        if (res.status === 500) {
            setLoading(false)
            alert('Server error try again later')
        }
        setLoading(false)
    }

    return (
        <Form onSubmit={e => e.preventDefault()}>
            <CropPicture imgFile={imgFile} imgB64={imgB64} setImgB64={setImgB64} defaultImg={img}/>
            <Form.Group className={'mb-3'}>
                <Form.Label>Upload profile picture</Form.Label>
                <Form.Control type="file" accept={'image/*'} className={styles.inputStyle} onChange={(e) => {

                    e.target.files.length > 0 ? setImgFile(e.target.files[0]) : setImgFile(file => file)
                }}/>
            </Form.Group>
            <Form.Group className={'mb-3'} style={memberStyle}>
                <Form.Label>Add residents in your apartment</Form.Label>
                <div className={'d-flex flex-column'}>
                    {members.map((m) =>
                        <div className={'d-flex flex-row mb-2'} key={m._id}>
                            <Form.Control style={{width: '35%'}} className={`${styles.inputStyle} mb-1 mx-1`} type={'text'} placeholder={'Name'} value={m.name} onChange={e => setNameAgeRes(m._id, e.target.value, m.age, m.residentType)}/>
                            <Form.Select style={{width: '35%'}} className={`${styles.inputStyle} ${styles.inputStyleSelect}`} value={m.residentType} onChange={(e) => setNameAgeRes(m._id, m.name, m.age, e.target.value)}>
                                <option value={'Resident Type'}>Resident Type</option>
                                <option value={'Owner'}>Owner</option>
                                <option value={'Co-Owner'}>Co-Owner</option>
                                <option value={'Tenant'}>Tenant</option>
                                <option value={'Family'}>Family</option>
                            </Form.Select>
                            <Form.Control style={{width: '30'}} className={`${styles.inputStyle} mb-1 mx-1 w-25`} type={'number'} placeholder={'Age'} value={m.age} onChange={e => setNameAgeRes(m._id, m.name, e.target.value, m.residentType)}/>
                            <Button className={'mb-1'} variant={'outline-light'} onClick={() => removeName(m._id)}><AiOutlineClose size={20}/></Button>
                        </div>
                    )}
                </div>
                <Button variant={'outline-light'} onClick={addMember}>Add</Button>
            </Form.Group>
            <Form.Group className={'mb-3'}>
                <Form.Label>Add owned parking spots</Form.Label>
                <div className={'d-flex flex-column'}>
                    {parkingNos.map((p, index) =>
                        <div className={'d-flex flex-row'} key={index}>
                            <Form.Control className={`${styles.inputStyle} mb-1 mx-1`} type={'number'} value={p} onChange={(e) => editParkingSpot(e.target.value, index)}/>
                            <Button className={'mb-1'} variant={'outline-light'} onClick={() => removeParkingNo(index)}><AiOutlineClose size={20}/></Button>
                        </div>
                    )}
                </div>
                <Button variant={'outline-light'} onClick={addParking}>Add</Button>
            </Form.Group>
            <Form.Group className={'mb-3'}>
                <Form.Label>Enter Phone Number</Form.Label>
                <Form.Control style={numberStyle} value={number} className={styles.inputStyle} type={"text"} placeholder={'0123456789'} onChange={e => validateNumber(e.target.value)}/>
            </Form.Group>
            <div className={'text-center'}>
                <LoadingButton type={'submit'} variant={'outline-success'} className={'my-3 mx-auto'} onClick={(e) => update(e)} loading={loading} text={'Update'}/>
            </div>
        </Form>
    )
}

export default UpdateUser