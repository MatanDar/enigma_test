import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function LoginOrReg(props) {

    let [regMode, setregMode] = useState(false)


    function submitRegister() {

        props.socket.emit("bdikale", { a: "a" })

    }

    return (
        <div>
            {(() => {

                if (regMode) {
                    return (
                        <div>
                            <label>Name</label>
                            <TextField></TextField>
                            <br />
                            <label>Username</label>
                            <TextField></TextField>
                            <br />
                            <label>Password</label>
                            <TextField></TextField>
                            <br />
                            <label>Age</label>
                            <TextField></TextField>
                            <br />
                            <label>Email</label>
                            <TextField></TextField>
                            <br />
                            <Button onClick={() => { submitRegister() }}>Register</Button>
                        </div>
                    )
                }
                else {
                    return (
                        <div>
                            <label>Username</label>
                            <TextField></TextField>
                            <br />
                            <label>Password</label>
                            <TextField></TextField>
                            <br />
                            <Button>Login</Button>
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