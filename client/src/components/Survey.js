import React, {useState} from 'react'
import {Button, Form} from "react-bootstrap";
import validator from "validator/es";

const Survey = () => {
    const [houseNo, setHouseNo] = useState('')
    const [number, setNumber] = useState('')
    const [email, setEmail] = useState('')
    const [response, setResponse] = useState('')

    const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K']

    const validateHouseNo = (houseNo) => {

        const normHouseNo = houseNo.charAt(0).toUpperCase() + houseNo.slice(1)
        console.log(normHouseNo)
        if (normHouseNo.length > 5 || normHouseNo.length < 5) {
            return false
        }
        if (!blocks.includes(normHouseNo.charAt(0))) {
            return true
        }
        return true
    }

    const validateNumber = (number) => {
        return validator.isMobilePhone(number)
    }

    const validateEmail = (email) => {
        return validator.isEmail(email)
    }

    const validate = (houseNo, number, email) => {
        if (!validateHouseNo(houseNo)) {
            alert('Invalid House Number')
            return false
        }
        if (!validateEmail(email)) {
            alert('Invalid Email')
            return false
        }
        if (!validateNumber(number)) {
            alert('Invalid Number')
            return false
        }
        return true
    }

    const sendSurvey = async () => {
        if (!validate(houseNo, number, email)) {
            return
        }
        const res = await fetch('http://localhost:8080/api/survey', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "houseNo": houseNo,
                "email": email,
                "number": number,
                "response": response
            })
        })
        if (res.status === 200) {

            const data = await res.json()
            console.log(data)
            if (data.message === 'updated') {
                alert('Your submission has been updated')
            }
            if (data.message === 'saved') {
                alert('You submission has been saved')
            }
        }

    }

    const styles1 = {
        height: "100%",
        width:"50%",

    }


    return (

        <>
            <div style={styles1} className={"mx-auto"}>
                <h1 className={"text-center mt-5"}>Survey</h1>
                <Form className={"mx-auto d-flex flex-column justify-content-between align-items-center"}>
                    <Form.Group className={"mb-3 mt-5" }>
                        <Form.Label>Enter Apartment Number</Form.Label>
                        <Form.Control type={"text"} placeholder={"example: J606"} onChange={e => setHouseNo(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={"mb-3"}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={"mb-3"}>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" placeholder="Phone Number" onChange={e => setNumber(e.target.value)}/>
                    </Form.Group>
                    <Form.Group style={{width:"80%"}} className={"mx-auto"}>
                        <Form.Label>Do you approve to this adhoc committee to represent behalf of you to initiate resident welfare association?</Form.Label>
                        <Form.Check type={'radio'} label={'Yes'} name={'response'} onClick={e => setResponse('Yes')}/>
                        <Form.Check type={'radio'} label={'No'} name={'response'} onClick={e => setResponse('No')}/>
                        <Form.Check type={'radio'} label={'Not Sure'} name={'response'} onClick={e => setResponse('Not Sure')}/>
                    </Form.Group>
                    <Button variant={"outline-dark"} onClick={sendSurvey}>Submit</Button>

                </Form>
            </div>
        </>
    )
}

export default Survey