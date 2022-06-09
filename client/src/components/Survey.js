import React, {useRef, useState} from 'react'
import {Button, Form} from "react-bootstrap";
import {url} from '../assets/js/url'
import LoadingButton from "./LoadingButton";
import {useNavigate} from "react-router-dom";
import styles from '../css/InputText.module.css'

const Survey = () => {
    const [responses, setResponses] = useState([
        {question: 'q1', answer: '', remarks: ''},
        {question: 'q2', answer: '', remarks: ''},
        {question: 'q3', answer: '', remarks: ''},
        {question: 'q4', answer: '', remarks: ''},
        {question: 'q5', answer: '', remarks: ''}
    ])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const setAnswer = (q, a) => {
        const responsesCopy = responses
        for (let i = 0; i < responsesCopy.length; i++) {
            if (responsesCopy[i].question === q) {
                responsesCopy[i].answer = a
                setResponses(responsesCopy)
                console.log(responses)
                return
            }
        }
    }

    const setRemarks = (q, r) => {
        const responsesCopy = responses
        for (let i = 0; i < responsesCopy.length; i++) {
            if (responsesCopy[i].question === q) {
                responsesCopy[i].remarks = r
                setResponses(responsesCopy)
                console.log(responses)
                return
            }
        }
    }

    const validateResponses = () => {
        for (let i of responses) {
            if (i.answer.length === 0) {
                alert('Answer all questions')
                return false
            }
        }
        return true
    }

    const sendSurvey = async () => {
        if (!validateResponses()) {
            return
        }
        setLoading(true)
        const res = await fetch(`${url}/api/survey`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            },
            body: JSON.stringify({
                responses: responses
            })
        })
        if (res.status === 200) {
            alert('Successfully submitted')
            setLoading(false)
            navigate('/home')
            return
        }
        if (res.status === 403) {
            alert('You have already submitted this survey')
            setLoading(false)
            navigate('/home')
            return
        }
        if (res.status === 500) {
            alert('Server error try again later')
            setLoading(false)
            navigate('/home')
            return
        }
        setLoading(false)
    }

    const Questions = () => {
        return (
            responses.map((i) => (

                <Form.Group key={i.question} style={{width:"80%"}} className={"my-3 mx-auto"}>
                    <Form.Label>{i.question}</Form.Label>
                    <Form.Check type={'radio'} label={'Yes'} name={i.question} onClick={() => setAnswer(i.question, 'Yes')}/>
                    <Form.Check type={'radio'} label={'No'} name={i.question} onClick={() => setAnswer(i.question, 'No')}/>
                    <Form.Check type={'radio'} label={'Not Sure'} name={i.question} onClick={() => setAnswer(i.question, 'Not Sure')}/>
                    <Form.Control type={'text'} className={`${styles.inputStyle}`} placeholder={'Remarks'} onChange={(e) => setRemarks(i.question, e.target.value)}/>
                </Form.Group>

            ))
        )
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
                    <Questions />
                    {/*<Button variant={"outline-light"} className={'my-5'} onClick={sendSurvey}>Submit</Button>*/}
                    <LoadingButton onClick={sendSurvey} loading={loading} text={'Submit'}/>
                </Form>
            </div>
        </>
    )
}

export default Survey