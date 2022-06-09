import React, {useRef, useState} from 'react'
import {Button, Form} from "react-bootstrap";
import {url} from '../assets/js/url'
import LoadingButton from "./LoadingButton";
import {useNavigate} from "react-router-dom";

const Survey = () => {
    const [responses, setResponses] = useState([
        {question: 'q1', answer: ''},
        {question: 'q2', answer: ''},
        {question: 'q3', answer: ''},
        {question: 'q4', answer: ''},
        {question: 'q5', answer: ''}
    ])
    const [remarks, setRemarks] = useState('')
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
                remarks: remarks,
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
                    <Form.Check type={'radio'} label={'1'} name={i.question} onClick={() => setAnswer(i.question, '1')}/>
                    <Form.Check type={'radio'} label={'2'} name={i.question} onClick={() => setAnswer(i.question, '2')}/>
                    <Form.Check type={'radio'} label={'3'} name={i.question} onClick={() => setAnswer(i.question, '3')}/>
                    <Form.Check type={'radio'} label={'4'} name={i.question} onClick={() => setAnswer(i.question, '4')}/>
                    <Form.Check type={'radio'} label={'5'} name={i.question} onClick={() => setAnswer(i.question, '5')}/>
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