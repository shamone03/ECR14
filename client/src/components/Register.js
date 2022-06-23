import React, {useEffect, useRef, useState} from 'react';
import {Button, Form, Image, Modal, Spinner} from "react-bootstrap";
import styles from '../css/Register.module.css'
import validator from "validator/es"
import {url} from "../assets/js/url";
import RedirectLogin from "./RedirectLogin";
import {AiFillLinkedin, AiOutlineRight, GrFormNext} from "react-icons/all";
import {Link, useNavigate} from "react-router-dom";
import LoadingButton from "./LoadingButton";
import PrivacyPolicy from "./PrivacyPolicy";



const Register = () => {
    const canvasRef = useRef(null)
    const imgRef = useRef(null)
    const validStyle = {border: '3px #181a1b solid'}
    const invalidStyle = {border: '3px red solid'}
    const navigate = useNavigate()

    const [passwordStyle, setPasswordStyle] = useState(validStyle)
    const [aptNoStyle, setAptNoStyle] = useState(validStyle)
    const [emailStyle, setEmailStyle] = useState(validStyle)
    const [numberStyle, setNumberStyle] = useState(validStyle)
    const [residentTypeStyle, setResidentTypeStyle] = useState(validStyle)
    const [ageStyle, setAgeStyle] = useState(validStyle)
    const [nameStyle, setNameStyle] = useState(validStyle)
    const [houseNo, setHouseNo] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [number, setNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [residentType, setResidentType] = useState('Resident Type')
    const [age, setAge] = useState(0)
    const [name, setName] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [page, setPage] = useState(1)
    const [registered, setRegistered] = useState([])
    const [registeredEmail, setRegisteredEmail] = useState('')
    const [page2Loading, setPage2Loading] = useState(false)
    const [imgFile, setImgFile] = useState(new File([], "", undefined))
    const [imgB64, setImgB64] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [privacy, setPrivacy] = useState(false)

    const blocks = ['A101','A102','A201','A202','A301','A302','A401','A402','A501','A502','A601','A602','A701','A702','A801','A802','A901','A902','A1001','A1002','A1101','A1102','A1201','A1202','A1301','A1302','B1302','B1303','B101','B102','B103','B104','B201','B202','B203','B204','B301','B302','B303','B304','B401','B402','B403','B404','B501','B502','B503','B504','B601','B602','B603','B604','B701','B702','B703','B704','B801','B802','B803','B804','B901','B902','B903','B904','B1001','B1002','B1003','B1004','B1101','B1102','B1103','B1104','B1201','B1202','B1203','B1204','B1301','B1304','B1401','B1404','C102','C103','C104','C201','C202','C203','C204','C301','C302','C303','C304','C401','C402','C403','C404','C501','C502','C503','C504','C601','C602','C603','C604','C701','C702','C703','C704','C801','C802','C803','C804','C901','C902','C903','C904','C1001','C1002','C1003','C1004','C1101','C1102','C1103','C1104','C1202','C1203','C1301','C1302','C1303','C1304','C1402','C1403','D102','D103','D201','D202','D203','D204','D301','D302','D303','D304','D401','D402','D403','D404','D501','D502','D503','D504','D601','D602','D603','D604','D701','D702','D703','D704','D801','D802','D803','D804','D901','D902','D903','D904','D1001','D1002','D1003','D1004','D1101','D1102','D1103','D1104','D1202','D1203','D1301','D1302','D1303', 'D1304','D1402','D1403','E102','E103','E201','E202','E203','E204','E301','E302','E303','E304','E401','E402','E403','E404','E501','E502','E503','E504','E601','E602','E603','E604','E701','E702','E703','E704','E802','E803','E902','E903','E904','E1001','E1002','E1003','E1101','E1102','E1103','E1104','E1202','E1203','E1301','E1302','E1303','E1304','E1402','E1004','F102','F103','F201','F202','F203','F204','F301','F302','F303','F304','F401','F402','F403','F404','F501','F502','F503','F504','F601','F602','F603','F604','F701','F702','F703','F704','F802','F803','F901','F902','F903','F1001','F1002','F1003','F1004','F1101','F1102','F1103','F1104','F1202','F1203','F1301','F1302','F1303','F1304','F1403','G102','G103','G201','G202','G203','G204','G301','G302','G303','G304','G401','G402','G403','G404','G501','G502','G503','G504','G601','G602','G603','G604','G701','G702','G703','G704','G801','G802','G803','G804','G901','G902','G903','G904','G1001','G1002','G1003','G1004','G1101','G1102','G1103','G1104','G1202','G1203','G1301','G1302','G1303','G1304','G1403','H101','H102','H201','H202','H203','H204','H301','H302','H303','H304','H401','H402','H403','H404','H501','H502','H503','H504','H601','H602','H603','H604','H701','H702','H703','H704','H801','H802','H803','H804','H901','H902','H903','H904','H1001', 'H1002','H1003','H1004','H1101','H1102','H1103','H1104','H1202','H1203','H1301','H1302','H1303','H1304','H1403','K101','K102','K103','K104','K201','K202','K203','K204','K301','K302','K303','K304','K401','K402','K403', 'K404','K501','K502','K503','K504','K601','K602','K603','K604','K701','K702','K703','K704','K801','K804','K901','K902','K903','K904','K1001','K1002','K1003','K1004','K1101','K1102','K1103','K1104','K1201','K1202','K1203','K1204','K1301','K1302','K1303','K1304','K1401','K1402','K1403','K1404','J101','J102','J103','J104','J105','J106','J107','J108','J109','J110','J111','J201','J202','J203','J204','J205','J206','J207','J208','J209','J210','J211','J301','J302','J303','J304','J305','J306','J307','J308','J309','J310','J311','J401','J402','J403','J404','J405','J406','J407','J408','J409','J410','J411','J501','J502','J503','J504','J505','J506','J507','J508','J509','J510','J511','J601','J602','J603','J604','J605','J606','J607','J608','J609','J610','J611','J701','J702','J703','J704','J705','J706','J707','J708','J709','J710','J711','J801','J802','J803','J804','J805','J806','J807','J808','J811','J901','J902','J903','J904','J905','J906','J907','J908','J909','J910','J911','J1001','J1002','J1003','J1004','J1005','J1006','J1007','J1008','J1009','J1010','J1011','J1101','J1102','J1103','J1104','J1105','J1106','J1107','J1108','J1109','J1110','J1111','J1201','J1202','J1203','J1204','J1205','J1206','J1207','J1208','J1209','J1210','J1211','J1301','J1302','J1303','J1304','J1305','J1306','J1307','J1308','J1309','J1310','J1311','J1401','J1402','J1403','J1404','J1405','J1406','J1407','J1408','J1409','J1410','J1411']

    useEffect(() => {
        if (page === 3 && imgFile.name) {
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

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${url}/api/registered`, {
                method: 'GET',
                headers: {"Content-Type": "application/json"},
            })
            if (res.status === 200) {
                const data = await res.json()
                setRegistered(data)
            }

        }
        fetchData()

    }, [])

    useEffect(() => {
        console.log({
            houseNo, residentType, number, password, passwordConfirm, email, age, registered, imgB64, imgFile
        })
    }, [houseNo, residentType, number, password, passwordConfirm, email, age, registered, imgFile, imgB64])

    const validateHouseNo = (houseNo) => {
        const normHouseNo = houseNo.charAt(0).toUpperCase() + houseNo.slice(1)
        if (!blocks.includes(normHouseNo)) {
            setAptNoStyle(invalidStyle)
        } else {
            setAptNoStyle(validStyle)
            setHouseNo(normHouseNo)
        }
        return blocks.includes(normHouseNo)
    }

    const contains = (registered, houseNo) => {
        for (let i of registered) {
            if (i.houseNo === houseNo) {
                return true
            }
        }
        return false
    }

    const setNextPage = () => {
        if (!validateHouseNo(houseNo)) {
            setAptNoStyle(invalidStyle)
            alert('Invalid Apartment Number')

        } else {
            console.log(registered)
            if (contains(registered, houseNo)) {
                for (let i of registered) {
                    if (i.houseNo === houseNo) {
                        if (i.registeredArtificially) {
                            setRegisteredEmail(i.email)
                            setPage(2)
                        } else {
                            alert('Already registered, redirecting to login')
                            navigate('/login')
                        }
                    }
                }
            } else {
                setPage(3)
            }

        }
        // setPage(2)
    }

    const validateNumber = (number) => {
        if (!validator.isMobilePhone(number)) {
            setNumberStyle(invalidStyle)
        } else {
            setNumberStyle(validStyle)
            setNumber(number)
        }
        return validator.isMobilePhone(number)
    }

    const validateResidentType = (residentType) => {
        const types = ['Owner', 'Co-Owner', 'Tenant', 'Family']
        if (!types.includes(residentType)) {
            setResidentTypeStyle(invalidStyle)
            setResidentType(residentType)
            return false
        } else {
            setResidentTypeStyle(validStyle)
            setResidentType(residentType)
            return true
        }
    }

    const validateAge = (age) => {
        if (parseInt(age) < 18 || parseInt(age) > 100) {
            setAgeStyle(invalidStyle)
            setAge(age)
            return false
        } else {
            setAgeStyle(validStyle)
            setAge(age)
        }
        return true
    }

    const validateName = (name) => {
        if (!name) {
            setName(name)
            setNameStyle(invalidStyle)
            return false
        }
        if (name.length < 3) {
            setName(name)
            setNameStyle(invalidStyle)
            return false
        } else {
            setName(name)
            setNameStyle(validStyle)
        }
        return true
    }

    const validateEmail = (email) => {
        if (!validator.isEmail(email)) {
            setEmailStyle(invalidStyle)
        } else {
            setEmailStyle(validStyle)
            setEmail(email)
        }
        return validator.isEmail(email)
    }

    const validatePasswords = (password, passwordConfirm) => {
        setPassword(password)
        setPasswordConfirm(passwordConfirm)
        console.log(password)
        if (password.length < 8) {
            setPasswordStyle(invalidStyle)
            // alert('Password is too short')
            return 'short'
        }
        if (password !== passwordConfirm) {
            setPasswordStyle(invalidStyle)
            // alert('Passwords do not match')
            return 'match'
        }
        setPasswordStyle(validStyle)
    }

    const validate = () => {
        if (!validateHouseNo(houseNo)) {
            setAptNoStyle(invalidStyle)
            alert('Invalid Apartment Number')
            return false
        } else {
            setAptNoStyle(validStyle)
        }
        if (!validateEmail(email)) {
            setEmailStyle(invalidStyle)
            alert('Invalid Email')
            return false
        } else {
            setEmailStyle(validStyle)
        }
        if (!validateNumber(number)) {
            setNumberStyle(invalidStyle)
            alert('Invalid Number')
            return false
        } else {
            setNumberStyle(validStyle)
        }
        if (!validateResidentType(residentType)) {
            setResidentTypeStyle(invalidStyle)
            alert('Choose Resident Type')
            return false
        } else {
            setResidentTypeStyle(validStyle)
        }
        if (!validateAge(age)) {
            setAgeStyle(invalidStyle)
            alert('Enter Age between 18 and 100')
            return false
        } else {
            setAgeStyle(validStyle)
        }
        if (!validateName(name)) {
            alert('Name should be at least 3 characters')
            setNameStyle(invalidStyle)
            return false
        } else {
            setNameStyle(validStyle)
        }
        if (validatePasswords(password, passwordConfirm) === 'short') {
            alert('Password is too short')
            return false
        }
        if (validatePasswords(password, passwordConfirm) === 'match') {
            alert('Passwords do not match')
            return false
        }

        return true
    }

    const decline = (e) => {
        e.preventDefault()
        setPrivacy(false)
        alert('Accept privacy policy to continue')
        setShowModal(false)
    }

    const accept = async (e) => {
        e.preventDefault()
        setShowModal(false)
        setPrivacy(true)
        await registerUser(e)
    }

    const validateAndShow = (e) => {
        e.preventDefault()
        if (!validate()) {
            return
        }
        setShowModal(true)
    }

    const registerUser = async (e) => {
        e.preventDefault()
        console.log({houseNo, email, password, passwordConfirm, name, age, residentType, number})
        setLoading(true)
        const res = await fetch(`${url}/api/register`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                houseNo: houseNo,
                email: email,
                password: password,
                number: number,
                names: Array.of({name, age, residentType}),
                imgBase64: imgB64 ? imgB64.split(',')[1] : ''
            })
        })
        if (res.status === 200) {
            setLoading(false)
            alert('Click the link on the email sent to your account to finish signing up')
            setLoggedIn(true)
        }
        if (res.status === 500) {
            const data = await res.json()
            setLoading(false)
            setLoggedIn(false)
            if (data.e.code === 11000) {
                alert('Apartment Number or Email already exists')
            } else {
                alert('Server error try again later')
            }
        }
    }

    const resetPassword = async () => {
        setPage2Loading(true)
        const res = await fetch(`${url}/api/resetPassword`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                houseNo: houseNo
            })
        })
        if (res.status === 200) {
            alert('Click link sent to email to set password')
            setPage2Loading(false)
            navigate('/login')
        } else {
            setPage2Loading(false)
            alert('Server error')
        }

    }

    if (page === 1) {
        return (
            <>
                <RedirectLogin loggedIn={!loggedIn}/>
                <h1 className={'text-center'}>Register</h1>
                <Form className={'container-lg'}>
                    <div className={'row justify-content-center'}>
                        <div className={'col-6 col-md-4'}>
                            <Form.Group className={"mb-3 mt-5"}>
                                <Form.Label>Enter Apartment Number</Form.Label>
                                <Form.Control style={aptNoStyle} className={styles.inputStyle} type={"text"} placeholder={"example: J606"} onChange={e => validateHouseNo(e.target.value)}/>
                                {/*{alrExists ? (<small style={{color: 'red'}}>Apartment Number already exists click Next to reset password or login</small>) : (<></>)}*/}
                            </Form.Group>
                        </div>
                    </div>
                    <div className={'row justify-content-center'}>
                        <div className={'col-6 col-md-4 d-flex justify-content-end'}>
                            <Button variant={'outline-light'} onClick={setNextPage} type={'submit'}>Next<AiOutlineRight/></Button>
                        </div>
                    </div>
                </Form>
            </>
        )
    }

    if (page === 2) {
        return (
            <>
                <h1 className={'text-center'}>Register</h1>
                <div className={'container'}>
                    <div className={'row justify-content-center'}>
                        <h2 className={'text-center mt-5'}>Apartment Number already registered with email {registeredEmail}</h2>
                        <div className={'col-6 col-md-4 mt-5 d-flex justify-content-center'}>
                            <LoadingButton variant={'outline-success'} className={'mt-5'} onClick={resetPassword} type={'submit'} text={'Set Password'} loading={page2Loading}/>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (page === 3) {
        return (
            <>
                <RedirectLogin loggedIn={!loggedIn}/>
                <h1 className={'text-center mt-3'}>Register</h1>
                <div className={`d-flex justify-content-center align-items-center ${styles.formWrapper} mx-auto`}>
                    <Form className={`container`}>
                        <div className={'row'}>
                            <div className={'col-12r'}>
                                {imgFile.name ?
                                    <>
                                        <canvas ref={canvasRef} className={'d-none'}/>
                                        <Image src={URL.createObjectURL(imgFile)} className={'d-none'} ref={imgRef} alt={'prof pic'}/>
                                    </> : ''}
                                <div className={'d-flex flex-row justify-content-center w-100'}>
                                    {imgB64 !== '' ? <Image src={imgB64} width={150} height={150} roundedCircle alt={'prof pic'} className={'my-1'}/> : ''}
                                </div>
                                <Form.Group>
                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Label>Upload profile picture</Form.Label>
                                        <Form.Control type="file" accept={'image/*'} className={styles.inputStyle} onChange={(e) => {
                                            console.log(e.target.files)
                                            e.target.files.length > 0 ? setImgFile(e.target.files[0]) : setImgFile(file => file)
                                        }}/>
                                    </Form.Group>
                                </Form.Group>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-lg-6'}>
                                <Form.Group className={"mb-3 mt-5"}>
                                    <Form.Label>Enter Apartment Number</Form.Label>
                                    <Form.Control style={aptNoStyle} value={houseNo} className={styles.inputStyle} type={"text"} placeholder={"example: J606"} onChange={e => validateHouseNo(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className={'mb-3'}>
                                    <Form.Label>Enter Name</Form.Label>
                                    <Form.Control style={nameStyle} className={styles.inputStyle} type={'text'} placeholder={'Enter Name'} onChange={e => validateName(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className={'mb-3'}>
                                    <Form.Label>Enter Age</Form.Label>
                                    <Form.Control style={ageStyle} className={styles.inputStyle} type={'number'} placeholder={'18-100'} onChange={(e) => validateAge(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className={'mb-3'}>
                                    <Form.Label>Enter email</Form.Label>
                                    <Form.Control style={emailStyle} className={styles.inputStyle} type={"text"} placeholder={'example@email.com'} onChange={e => validateEmail(e.target.value)}/>
                                </Form.Group>

                            </div>
                            <div className={'col-lg-6'}>
                                <Form.Group className={`mt-lg-5 mb-3 `}>
                                    <Form.Label>Choose Resident Type</Form.Label>
                                    <Form.Select className={`${styles.selectStyle} ${styles.inputStyle}`} style={residentTypeStyle} onChange={(e) => validateResidentType(e.target.value)}>
                                        <option value={'Resident Type'}>Resident Type</option>
                                        <option value={'Owner'}>Owner</option>
                                        <option value={'Co-Owner'}>Co-Owner</option>
                                        <option value={'Tenant'}>Tenant</option>
                                        <option value={'Family'}>Family</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className={'mb-3'}>
                                    <Form.Label>Enter Phone Number</Form.Label>
                                    <Form.Control style={numberStyle} className={styles.inputStyle} type={"text"} placeholder={'0123456789'} onChange={e => validateNumber(e.target.value)}/>
                                </Form.Group>

                                <Form.Group className={'mb-3'}>
                                    <Form.Label>Enter Password</Form.Label>
                                    <Form.Control style={passwordStyle} className={styles.inputStyle} type={"password"} onChange={e => validatePasswords(e.target.value, passwordConfirm)}/>
                                </Form.Group>
                                <Form.Group className={'mb-3'}>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control style={passwordStyle} className={styles.inputStyle} type={"password"} onChange={e => validatePasswords(password, e.target.value)}/>
                                </Form.Group>
                            </div>
                        </div>
                        <div className={'text-center'}>
                            <LoadingButton variant={'outline-success'} onClick={(e) => validateAndShow(e)} type={'submit'} text={'Register'} loading={loading}/>
                        </div>

                        <Modal show={showModal} onHide={() => setShowModal(false)} scrollable centered>
                            <Modal.Header closeButton>
                                <Modal.Title><h4 style={{color: '#161b22'}}>Privacy Policy</h4></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <PrivacyPolicy style={{color: '#161b22'}}/>
                            </Modal.Body>
                            <Modal.Footer>
                                <div className={'d-flex w-100 justify-content-end h-'}>
                                    <Button variant={'outline-danger me-2'} onClick={(e) => decline(e)}>Decline</Button>
                                    <Button variant={'success'} onClick={(e) => accept(e)}>Accept</Button>
                                </div>
                            </Modal.Footer>
                        </Modal>
                    </Form>
                </div>

            </>
        )
    }

}

export default Register