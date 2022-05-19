import React, {useEffect, useState} from 'react';

const Register = () => {
    const [houseNo, setHouseNo] = useState('')
    const [members, setMembers] = useState([{name: '', key: 1}])
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const addMember = () => {
        setMembers([...members, {name: '', key: members[members.length - 1].key + 1}])
        console.log(members)
    }

    const setName = (i, newName) => {
        const membersCopy = [...members]
        membersCopy[i-1].name = newName
        setMembers(membersCopy)
        console.log(members)
    }

    const removeName = (removeName) => {

        console.log(removeName)
        const membersCopy = [...members]
        const newMembers = membersCopy.filter((member) => {
                                return removeName !== member.name
                            })

        for (let i = 0; i < newMembers.length; i++) {
            newMembers[i].key = i+1
        }
        setMembers(newMembers)
        console.log(members)
    }

    const validate = () => {
        if (password !== passwordConfirm) {
            alert('passwords do not match')
            return false
        }
        return true
    }
    const registerUser = async (e) => {
        if (!validate()) {
            return
        }
        e.preventDefault()
        const res = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                houseNo: houseNo,
                email: email,
                names: members,
                password: password
            })
        })
        if (res.status === 200) {
            const data = await res.json()
            // localStorage.setItem('token', data.token)
        } else {
            alert('invalid houseNo or password')
        }
    }

    const style1 = {
        width: "25%",
        display: "flex",
        flexDirection: "column",
    }

    const flexColumn = {
        display: "flex",
        flexDirection: "column",
        padding: "5%"
    }
    const flexRow = {
        display: "flex",
        flexDirection: "row"
    }

    const margin5 = {
        margin: "5%"
    }

    return (
        <div style={style1}>
            <h1>register</h1>
            <small>Enter Apt number</small>
            <input type="text" onChange={(e) => setHouseNo(e.target.value)}/>
            <small>enter email</small>
            <input type="text" onChange={(e) => setEmail(e.target.value)}/>
            <small>Add residents in your house</small>
            <div style = {flexColumn}>
                {[...members].map((m) =><div style={flexRow} key={m.key}>
                    <input type="text" style={margin5} key={m.key} value={m.name} onChange={(e) => setName(m.key, e.target.value)}/>
                    <button onClick={() => removeName(m.name)}>remove</button>
                </div> )}
                <button onClick={addMember} style={margin5}>add member</button>
            </div>
            <small>Enter password</small>
            <input type="text" onChange={(e) => setPassword(e.target.value)}/>
            <small>Confirm password</small>
            <input type="text" onChange={(e) => setPasswordConfirm(e.target.value)}/>
            <button onClick={registerUser}>Register</button>
        </div>

    )


}

export default Register