import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function LoginOrReg(props) {

    let [regMode, setregMode] = useState(false)

    let [name, setname] = useState("")
    let [username, setusername] = useState("")
    let [password, setpassword] = useState("")
    let [age, setage] = useState("")
    let [email, setemail] = useState("")


    let [loginUsername, setloginUsername] = useState("")
    let [loginPassword, setloginPassword] = useState("")

    async function submitRegister() {


        const res = await fetch('/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                username,
                password,
                age,
                email
            })
        });

        let data = await res.json()
        if (data.status == "success") {

            props.fetchUsers()

        }

    }

    async function submitLogin() {

        const res = await fetch('/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loginUsername,
                loginPassword
            })
        })

        let data = await res.json()

        if (data.status == "success") {
            props.setisLogged(true)
            console.log(data.isAdmin);
            props.setisAdmin(data.isAdmin)
        }
        else if (data.status == "failed") {
            alert("bad details")
        }
        else { // error
            alert("error try again")
        }

        console.log(data);

    }

    return (
        <div>
            {(() => {

                if (regMode) {
                    return (
                        <div>
                            <TextField label="Name" value={name} name="name" onChange={(ev) => { setname(ev.target.value) }}></TextField>
                            <br />
                            <TextField label="Username" value={username} onChange={(ev) => { setusername(ev.target.value) }} ></TextField>
                            <br />
                            <TextField label="Password" value={password} onChange={(ev) => { setpassword(ev.target.value) }} ></TextField>
                            <br />
                            <TextField label="Age" value={age} onChange={(ev) => { setage(ev.target.value) }} ></TextField>
                            <br />
                            <TextField label="Email" value={email} onChange={(ev) => { setemail(ev.target.value) }} ></TextField>
                            <br />
                            <Button onClick={() => { submitRegister() }}>Register</Button>
                        </div>
                    )
                }
                else {
                    return (
                        <div>
                            <TextField label="Username" value={loginUsername} onChange={(ev) => { setloginUsername(ev.target.value) }}></TextField>
                            <br />
                            <TextField label="Password" value={loginPassword} onChange={(ev) => { setloginPassword(ev.target.value) }}></TextField>
                            <br />
                            <Button onClick={() => { submitLogin() }}>Login</Button>
                        </div>
                    )

                }

            })()}
            <label>Switch to:</label><br />
            <Button onClick={() => { setregMode(false) }}>Log-in</Button>
            <Button onClick={() => { setregMode(true) }}>Register</Button>

        </div>
    )
}

export default LoginOrReg