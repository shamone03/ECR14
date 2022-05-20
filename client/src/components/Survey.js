import React, {useState} from 'react'
import {Button, Form} from "react-bootstrap";
import validator from "validator/es";

const Survey = () => {
    const [houseNo, setHouseNo] = useState('')
    const [number, setNumber] = useState('')
    const [email, setEmail] = useState('')
    const [response, setResponse] = useState('default')
    const [houseNoStyle, setHouseNoStyle] = useState({})
    const [emailStyle, setEmailStyle] = useState({})
    const [numberStyle, setNumberStyle] = useState({})

    const blocks = ['A101','A102','A201','A202','A301','A302','A401','A402','A501','A502','A601','A602','A701','A702','A801','A802','A901','A902','A1001','A1002','A1101','A1102','A1201','A1202','A1301','A1302','B1302','B1303','B101','B102','B103','B104','B201','B202','B203','B204','B301','B302','B303','B304','B401','B402','B403','B404','B501','B502','B503','B504','B601','B602','B603','B604','B701','B702','B703','B704','B801','B802','B803','B804','B901','B902','B903','B904','B1001','B1002','B1003','B1004','B1101','B1102','B1103','B1104','B1201','B1202','B1203','B1204','B1301','B1304','B1401','B1404','C102','C103','C104','C201','C202','C203','C204','C301','C302','C303','C304','C401','C402','C403','C404','C501','C502','C503','C504','C601','C602','C603','C604','C701','C702','C703','C704','C801','C802','C803','C804','C901','C902','C903','C904','C1001','C1002','C1003','C1004','C1101','C1102','C1103','C1104','C1202','C1203','C1301','C1302','C1303','C1304','C1402','C1403','D102','D103','D201','D202','D203','D204','D301','D302','D303','D304','D401','D402','D403','D404','D501','D502','D503','D504','D601','D602','D603','D604','D701','D702','D703','D704','D801','D802','D803','D804','D901','D902','D903','D904','D1001','D1002','D1003','D1004','D1101','D1102','D1103','D1104','D1202','D1203','D1301','D1302','D1303', 'D1304','D1402','D1403','E102','E103','E201','E202','E203','E204','E301','E302','E303','E304','E401','E402','E403','E404','E501','E502','E503','E504','E601','E602','E603','E604','E701','E702','E703','E704','E802','E803','E902','E903','E904','E1001','E1002','E1003','E1101','E1102','E1103','E1104','E1202','E1203','E1301','E1302','E1303','E1304','E1402','E1004','F102','F103','F201','F202','F203','F204','F301','F302','F303','F304','F401','F402','F403','F404','F501','F502','F503','F504','F601','F602','F603','F604','F701','F702','F703','F704','F802','F803','F901','F902','F903','F1001','F1002','F1003','F1004','F1101','F1102','F1103','F1104','F1202','F1203','F1301','F1302','F1303','F1304','F1403','G102','G103','G201','G202','G203','G204','G301','G302','G303','G304','G401','G402','G403','G404','G501','G502','G503','G504','G601','G602','G603','G604','G701','G702','G703','G704','G801','G802','G803','G804','G901','G902','G903','G904','G1001','G1002','G1003','G1004','G1101','G1102','G1103','G1104','G1202','G1203','G1301','G1302','G1303','G1304','G1403','H101','H102','H201','H202','H203','H204','H301','H302','H303','H304','H401','H402','H403','H404','H501','H502','H503','H504','H601','H602','H603','H604','H701','H702','H703','H704','H801','H802','H803','H804','H901','H902','H903','H904','H1001', 'H1002','H1003','H1004','H1101','H1102','H1103','H1104','H1202','H1203','H1301','H1302','H1303','H1304','H1403','K101','K102','K103','K104','K201','K202','K203','K204','K301','K302','K303','K304','K401','K402','K403', 'K404','K501','K502','K503','K504','K601','K602','K603','K604','K701','K702','K703','K704','K801','K804','K901','K902','K903','K904','K1001','K1002','K1003','K1004','K1101','K1102','K1103','K1104','K1201','K1202','K1203','K1204','K1301','K1302','K1303','K1304','K1401','K1402','K1403','K1404','J101','J102','J103','J104','J105','J106','J107','J108','J109','J110','J111','J201','J202','J203','J204','J205','J206','J207','J208','J209','J210','J211','J301','J302','J303','J304','J305','J306','J307','J308','J309','J310','J311','J401','J402','J403','J404','J405','J406','J407','J408','J409','J410','J411','J501','J502','J503','J504','J505','J506','J507','J508','J509','J510','J511','J601','J602','J603','J604','J605','J606','J607','J608','J609','J610','J611','J701','J702','J703','J704','J705','J706','J707','J708','J709','J710','J711','J801','J802','J803','J804','J805','J806','J807','J808','J811','J901','J902','J903','J904','J905','J906','J907','J908','J909','J910','J911','J1001','J1002','J1003','J1004','J1005','J1006','J1007','J1008','J1009','J1010','J1011','J1101','J1102','J1103','J1104','J1105','J1106','J1107','J1108','J1109','J1110','J1111','J1201','J1202','J1203','J1204','J1205','J1206','J1207','J1208','J1209','J1210','J1211','J1301','J1302','J1303','J1304','J1305','J1306','J1307','J1308','J1309','J1310','J1311','J1401','J1402','J1403','J1404','J1405','J1406','J1407','J1408','J1409','J1410','J1411']

    const validateHouseNo = (houseNo) => {
        const normHouseNo = houseNo.charAt(0).toUpperCase() + houseNo.slice(1)
        return blocks.includes(normHouseNo)
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
            setHouseNoStyle({border: "1px solid red"})
            return false
        } else {
            setHouseNoStyle({})
        }
        if (!validateEmail(email)) {
            alert('Invalid Email')
            setEmailStyle({border: "1px solid red"})
            return false
        } else {
            setEmailStyle({})
        }
        if (!validateNumber(number)) {
            alert('Invalid Number')
            setNumberStyle({border: "1px solid red"})
            return false
        } else {
            setNumberStyle({})
        }
        if (response === 'default') {
            alert('Choose an option')
            return false
        }
        return true
    }

    const sendSurvey = async () => {
        if (!validate(houseNo, number, email)) {
            return
        }
        const res = await fetch('https://ecr14.org/api/survey', {
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
            if (data.message === 'exists') {
                alert('You have already submitted this form')
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
                        <Form.Control style={houseNoStyle} type={"text"} placeholder={"example: J606"} onChange={e => setHouseNo(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={"mb-3"}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control style={emailStyle} type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={"mb-3"}>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control style={numberStyle} type="text" placeholder="Phone Number" onChange={e => setNumber(e.target.value)}/>
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