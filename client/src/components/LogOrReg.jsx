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
                name, username, password, age, email
            })
        });
        let data = await res.json()
        const message = data.message

        if (name == "" || username == "" || password == "" || age == "" || email == "") {
            alert("can not leave this field empty")
            setregMode(true)
            return
        }

        if (message) {
            alert(message)
            setregMode(true)
        }
        else if (data.status == "success") {
            props.fetchUsers()
            setregMode(false)
        }
    }

    async function submitLogin() {

        if (!loginUsername || !loginPassword) {
            return alert("missing login details")
        }
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
        else {
            alert("error try again")
        }
    }





    return (
        <div className="form">
            <div className="sign-up-form">
                {(() => {

                    if (regMode) {
                        return (
                            <div>
                                <TextField label="Name" value={name} name="name" onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? setname(ev.target.value) : null}></TextField>
                                <TextField label="Username" value={username} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? setusername(ev.target.value) : null} ></TextField>
                                <TextField label="Password" value={password} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? setpassword(ev.target.value) : null} ></TextField>
                                <TextField label="Age" value={age} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? setage(ev.target.value) : null} ></TextField>
                                <TextField label="Email" value={email} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? setemail(ev.target.value) : null} ></TextField>
                                <div className="btnContainer">
                                    <Button variant="contained" size="small" color="primary" type="submit" onClick={() => { submitRegister() }}>Register</Button>
                                </div>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div >
                                <TextField label="Username" value={loginUsername} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? setloginUsername(ev.target.value) : null}></TextField>
                                <TextField label="Password" value={loginPassword} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? setloginPassword(ev.target.value) : null}></TextField>
                                <div className="btnContainer">
                                    <Button variant="contained" size="small" color="primary" onClick={() => { submitLogin() }}>Login</Button>
                                </div>
                            </div>
                        )

                    }

                })()}

                <label>Switch to:</label>
                <div className="btnContainer">
                    <div>
                        <Button variant="outlined" color="primary" onClick={() => { setregMode(false) }}>Log-in</Button>
                    </div>
                    <div>
                        <Button variant="outlined" color="primary" onClick={() => { setregMode(true) }}>Register</Button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LoginOrReg