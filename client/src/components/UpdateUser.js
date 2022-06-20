import React, {useEffect, useState, useRef} from 'react'
import {Button, Form, Image} from "react-bootstrap";
import styles from "../css/InputText.module.css";
import {AiOutlineClose} from "react-icons/all";
import validator from "validator/es";
import {url} from "../assets/js/url";
import LoadingButton from "./LoadingButton";

const UpdateUser = ({img, members1, number1, resType}) => {
    const canvasRef = useRef(null)
    const imgRef = useRef(null)
    const [imgFile, setImgFile] = useState(new File([], "", undefined))
    const [memberStyle, setMemberStyle] = useState({})
    const [numberStyle, setNumberStyle] = useState({})
    const [resTypeStyle, setResTypeStyle] = useState({})
    const [loading, setLoading] = useState(false)

    const [imgB64, setImgB64] = useState('')
    const [members, setMembers] = useState([])
    const [residentType, setResidentType] = useState('')
    const [number, setNumber] = useState('')

    useEffect(() => {
        setMembers(members1)
        setResidentType(resType)
        setNumber(number1)
    }, [])

    useEffect(() => {
        if (imgFile.name) {
            const canvas = canvasRef.current
            const img = imgRef.current
            img.src = URL.createObjectURL(imgFile)

            img.onload = () => {
                const inputWidth = img.naturalWidth
                const inputHeight = img.naturalHeight
                const inputImageAspectRatio = inputWidth / inputHeight
                let outputWidth = inputWidth
                let outputHeight = inputHeight

                if (inputImageAspectRatio > 1) {
                    outputWidth = inputHeight * 1
                } else if (inputImageAspectRatio < 1) {
                    outputHeight = inputWidth / 1
                }
                const outputX = (outputWidth - inputWidth) * 0.5
                const outputY = (outputHeight - inputHeight) * 0.5
                canvas.width = outputWidth
                canvas.height = outputHeight

                const context = canvas.getContext('2d')
                context.drawImage(img, outputX, outputY)
                setImgB64(canvas.toDataURL('image/png'))
            }
        }
    }, [imgFile])

    const setNameAge = (_id, name, age) => {
        let membersCopy = members
        for (let i of membersCopy) {
            if (i._id === _id) {
                i.name = name
                i.age = age
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
            membersCopy.push({name: '', age: 0, _id: 1})
            setMembers([...membersCopy])
            return
        }
        membersCopy.push({name: '', age: 0, _id: members[members.length - 1]._id + 1})
        setMembers([...membersCopy])
        console.log(members)
    }

    const validateMembers = (members) => {
        if (members.length === 0) {
            alert('Add at least one resident')
            return false
        }
        for (let i of members) {
            if (i.name.length < 3) {
                alert('Names have to be longer that 3 characters')
                return false
            }
        }
        return true
    }

    const validateResidentType = (residentType) => {
        const types = ['Owner', 'Co-Owner', 'Tenant']
        if (!types.includes(residentType)) {
            setResTypeStyle({border: 'solid 3px red'})
            return false
        } else {
            setResTypeStyle({border: '3px transparent'})
            setResidentType(residentType)
            return true
        }
    }

    const validateNumber = (number) => {
        if (!validator.isMobilePhone(number)) {
            setNumberStyle({border: 'solid 3px red'})
        } else {
            setNumberStyle({border: '3px transparent'})
            setNumber(number)
        }
        return validator.isMobilePhone(number)
    }

    const validate = () => {
        if (!validateNumber(number)) {
            setNumberStyle({border: 'solid 3px red'})
            alert('Invalid Number')
            return false
        } else {
            setNumberStyle({border: '3px transparent'})
        }
        if (!validateResidentType(residentType)) {
            setResTypeStyle({border: 'solid 3px red'})
            alert('Choose Resident Type')
            return false
        } else {
            setResTypeStyle({border: '3px transparent'})
        }
        if (!validateMembers(members)) {
            setMemberStyle({border: 'solid 3px red'})
            return false
        } else {
            setMemberStyle({border: '3px transparent'})
        }
        return true
    }

    const update = async () => {
        if (!validate()) {
            return
        }
        setLoading(true)
        const res = await fetch(`${url}/api/update`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            },
            body: JSON.stringify({
                names: members.map(i => ({name: i.name, age: parseInt(i.age)})),
                number: number,
                residentType: residentType,
                imgBase64: imgB64 ? imgB64.split(',')[1] : ''
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
        <Form>
            {imgFile.name ?
                <>
                    <canvas ref={canvasRef} className={'d-none'}/>
                    <Image src={URL.createObjectURL(imgFile)} className={'d-none'} ref={imgRef} alt={'prof pic'}/>
                </> : ''}
            <div className={'d-flex flex-row justify-content-center w-100'}>
                {imgFile.name ? <Image src={imgB64} width={150} height={150} roundedCircle alt={'prof pic'}/> : img ? <Image src={img} width={150} height={150} roundedCircle alt={'prof pic'}/> : ''}
            </div>
            <Form.Group controlId="formFile" className={'mb-3'}>
                <Form.Label>Upload profile picture</Form.Label>
                <Form.Control type="file" accept={'image/*'} className={styles.inputStyle} onChange={(e) => {
                    console.log(e.target.files)
                    e.target.files.length > 0 ? setImgFile(e.target.files[0]) : setImgFile(file => file)
                }}/>
            </Form.Group>
            <Form.Group className={'mb-3'} style={memberStyle}>
                <Form.Label>Add residents in your apartment</Form.Label>
                <div className={'d-flex flex-column'}>
                    {members.map((m) =>
                        <div className={'d-flex flex-row'} key={m._id}>
                            <Form.Control className={`${styles.inputStyle} mb-1 mx-1`} type={'text'} placeholder={'Name'} value={m.name} onChange={e => setNameAge(m._id, e.target.value, m.age)}/>
                            <Form.Control className={`${styles.inputStyle} mb-1 mx-1`} type={'number'} placeholder={'Age'} value={m.age} onChange={e => setNameAge(m._id, m.name, e.target.value)}/>
                            <Button className={'mb-1'} variant={'outline-light'} onClick={() => removeName(m._id)}><AiOutlineClose size={20}/></Button>
                        </div>
                    )}
                </div>
                <Button variant={'outline-light'} onClick={addMember}>Add</Button>
            </Form.Group>
            <Form.Group className={'mb-3'} style={resTypeStyle}>
                <Form.Label>Choose Resident Type</Form.Label>
                <Form.Select className={`${styles.inputStyle}`} value={residentType} onChange={(e) => validateResidentType(e.target.value)}>
                    <option value={'Resident Type'}>Resident Type</option>
                    <option value={'Owner'}>Owner</option>
                    <option value={'Co-Owner'}>Co-Owner</option>
                    <option value={'Tenant'}>Tenant</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className={'mb-3'}>
                <Form.Label>Enter Phone Number</Form.Label>
                <Form.Control style={numberStyle} value={number} className={styles.inputStyle} type={"text"} placeholder={'0123456789'} onChange={e => validateNumber(e.target.value)}/>
            </Form.Group>
            <div className={'text-center'}>
                <LoadingButton type={'submit'} variant={'outline-success'} className={'my-3 mx-auto'} onClick={update} loading={loading} text={'Update'}/>
            </div>
        </Form>
    )
}

export default UpdateUser