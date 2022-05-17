import React, {useEffect, useState} from 'react';

const Register = () => {
    const [houseNo, setHouseNo] = useState('')
    const [noOfMembers, setNoOfMembers] = useState(1)
    const [members, setMembers] = useState([{name: '', key: 1}])
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [blockName, setBlockName] = useState('')


    const addMember = () => {
        console.log(members)
        setMembers([...members, {name: '', key: members[members.length - 1].key + 1}])
    }

    const setName = (i, newName) => {
        console.log(i)
        const membersCopy = [...members]
        membersCopy[i-1].name = newName

        setMembers(membersCopy)
    }

    const style1 = {
        width: "25%",
        display: "flex",
        flexDirection: "column"
    }

    return (
        <>
            <h1>register</h1>
            <small>Enter Apt number</small>
            <input type="text" onChange={(e) => setHouseNo(e.target.value)}/>
            <small>enter email</small>
            <input type="text" onChange={(e) => setEmail(e.target.value)}/>

            <small>Add residents in your house</small>
            <div style = {style1}>
                {[...members].map((m) => <input type="text" key={m.key} onChange={(e) => setName(m.key, e.target.value)}/>)}
                <button onClick={addMember}>add member</button>
            </div>
        </>

    )


}

export default Register