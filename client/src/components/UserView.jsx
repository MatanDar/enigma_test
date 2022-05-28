import React, { useState, useEffect } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import Modal from 'react-modal';
import Cookies from 'js-cookie'

function UserView(props) {

    let [users, setusers] = useState([])
    let [editMode, seteditMode] = useState(false)
    let [addMode, setaddMode] = useState(false)
    let [userToEdit, setuserToEdit] = useState({})

    let [name, setname] = useState("")
    let [username, setusername] = useState("")
    let [password, setpassword] = useState("")
    let [age, setage] = useState("")
    let [email, setemail] = useState("")

    useEffect(() => {
        setusers(props.users)
    }, [props.users])

    useEffect(() => {
        props.fetchUsers()
    }, [])

    async function handleDelete(id) {

        let res = await fetch('/delete/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id
            })
        })
        let data = await res.json()

        console.log(data);
        if (data.status == "success") {
            props.fetchUsers()
        }

    }

    function logout() {
        props.setisLogged(false)
        Cookies.remove("logged")
    }

    function add() {
        setaddMode(true)
    }

    function editEntry(id) {

        let user = users.filter(user => user.id == id)[0]

        console.log(user);
        setuserToEdit(user);
        seteditMode(true)

    }

    function handleEditChange(ev) {
        setuserToEdit({ ...userToEdit, [ev.target.name]: ev.target.value })
    }
    function handleAdminEdit(ev) {
        console.log(ev.target.checked);
        setuserToEdit({ ...userToEdit, isAdmin: ev.target.checked ? 1 : 0 })
    }
    async function submitEdit() {
        if (userToEdit.name == "" || userToEdit.username == "" || userToEdit.password == "" ||
            userToEdit.age == "" || userToEdit.email == "") {
            alert("can not leave this field empty")
            seteditMode(true)
            return
        } 
        let res = await fetch('/edit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userToEdit)
        })

        let data = await res.json()

        if (data.status == "success") {
            props.fetchUsers()
            seteditMode(false)
        }
        else if (data.status == "username alredy exist") {
            alert("username alredy exist")
        }

    }

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
        const message = data.message

        if (name == "" || username == "" || password == "" || age == "" || email == "") {
            alert("can not leave this field empty")
            setaddMode(true)
            return
        }

        if (message) {
            alert(message)
            setaddMode(true)

        }
        if (data.status == "success") {
            props.fetchUsers()
            setaddMode(false)
        }
    }

    return (
        <React.Fragment >
            <div className="btnContainer">
                <Button variant="contained" size="small" color="primary" onClick={() => { logout() }}>Logout</Button>
                <span>My Enigma Table</span>
                {props.isAdmin ? <Button variant="contained" size="small" color="primary" onClick={() => { add() }}>Add</Button> : ""}
            </div>
            <TableContainer component={Paper} className="tableContainer">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead className="header">
                        <TableRow>
                            {props.isAdmin ? <TableCell align="right">Id</TableCell> : null}
                            <TableCell align="right">username</TableCell>
                            {props.isAdmin ? <TableCell align="right">Password</TableCell> : null}
                            <TableCell align="right">name</TableCell>
                            <TableCell align="right">age</TableCell>
                            {props.isAdmin ? <TableCell align="right">Email</TableCell> : null}
                            {props.isAdmin ? <TableCell align="right">Is admin</TableCell> : null}
                            {props.isAdmin ? <TableCell align="right">Delete</TableCell> : null}
                            {props.isAdmin ? <TableCell align="right">Edit</TableCell> : null}

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => {
                            return (
                                <TableRow
                                    key={user.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {props.isAdmin ? <TableCell align="right">{user.id}</TableCell> : null}
                                    <TableCell align="right">{user.username}</TableCell>
                                    {props.isAdmin ? <TableCell align="right">{user.password}</TableCell> : null}
                                    <TableCell align="right">{user.name}</TableCell>
                                    <TableCell align="right">{user.age}</TableCell>
                                    {props.isAdmin ? <TableCell align="right">{user.email}</TableCell> : null}
                                    {props.isAdmin ? <TableCell align="right">{user.isAdmin}</TableCell> : null}
                                    {props.isAdmin ? <TableCell align="right"><Button onClick={() => { handleDelete(user.id) }}><DeleteForeverIcon /></Button></TableCell> : null}
                                    {props.isAdmin ? <TableCell align="right"><Button onClick={() => { editEntry(user.id) }}><EditIcon /></Button></TableCell> : null}

                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>
            </TableContainer>
            <div className="editContainer">
                <Modal isOpen={editMode} className="addEditForm">
                    <div className="flexContainer">
                        <label>username: </label>
                        <TextField name="username" value={userToEdit.username} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? handleEditChange(ev) : null}></TextField>
                        <label>password: </label>
                        <TextField name="password" value={userToEdit.password} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? handleEditChange(ev) : null} ></TextField>
                        <label>name: </label>
                        <TextField name="name" value={userToEdit.name} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? handleEditChange(ev) : null} ></TextField>
                        <label>age: </label>
                        <TextField name="age" value={userToEdit.age} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? handleEditChange(ev) : null} ></TextField>
                        <label>email: </label>
                        <TextField name="email" value={userToEdit.email} onChange={(ev) => /^[a-zA-Z0-9@.]*$/.test(ev.target.value) ? handleEditChange(ev) : null} ></TextField>
                        <label>is admin: </label>
                        <Checkbox name="isAdmin" checked={userToEdit.isAdmin == 0 ? false : true} onChange={(ev) => { handleAdminEdit(ev) }} ></Checkbox>
                        <div className="btnContainer">
                            <Button variant="contained" size="small" color="primary" onClick={() => { submitEdit() }}>submit</Button>
                            <Button variant="contained" size="small" color="primary" onClick={() => { seteditMode(false) }}>dismiss</Button>
                        </div>
                    </div>
                </Modal>
            </div>
            <div className="addContainer">
                <Modal isOpen={addMode} className="addEditForm">
                    <TextField label="Name" value={name} name="name" onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? setname(ev.target.value) : null}></TextField>
                    <TextField label="Username" value={username} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? setusername(ev.target.value) : null} ></TextField>
                    <TextField label="Password" value={password} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? setpassword(ev.target.value) : null} ></TextField>
                    <TextField label="Age" value={age} onChange={(ev) => /^[a-zA-Z0-9]*$/.test(ev.target.value) ? setage(ev.target.value) : null} ></TextField>
                    <TextField label="Email" value={email} onChange={(ev) => /^[a-zA-Z0-9@.]*$/.test(ev.target.value) ? setemail(ev.target.value) : null} ></TextField>
                    <div className="btnContainer">
                        <Button variant="contained" size="small" color="primary" type="submit" onClick={() => { submitRegister() }}>Add</Button>
                        <Button variant="contained" size="small" color="primary" onClick={() => { setaddMode(false) }}>dismiss</Button>
                    </div>
                </Modal>
            </div>


        </React.Fragment>
    )

}

export default UserView