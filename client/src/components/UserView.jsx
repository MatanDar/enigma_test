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

import Modal from 'react-modal';

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

        // userToEdit[ev.target.name] = ev.target.value

        setuserToEdit({ ...userToEdit, [ev.target.name]: ev.target.value })

    }

    function handleAdminEdit(ev) {
        console.log(ev.target.checked);
        setuserToEdit({ ...userToEdit, isAdmin: ev.target.checked ? 1 : 0 })
    }

    async function submitEdit() {

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
        if (data.status == "success") {

            props.fetchUsers()
            setaddMode(false)
        }

    }

    return (
        <React.Fragment>
            <Button onClick={() => { logout() }}>Logout</Button>
            <Button onClick={() => { add() }}>Add</Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {props.isAdmin ? <TableCell align="right">id</TableCell> : null}
                            <TableCell align="right">username</TableCell>
                            {props.isAdmin ? <TableCell align="right">password</TableCell> : null}
                            <TableCell align="right">name</TableCell>
                            <TableCell align="right">age</TableCell>
                            {props.isAdmin ? <TableCell align="right">email</TableCell> : null}
                            {props.isAdmin ? <TableCell align="right">is admin</TableCell> : null}
                            {props.isAdmin ? <TableCell align="right">delete</TableCell> : null}
                            {props.isAdmin ? <TableCell align="right">edit</TableCell> : null}

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
                                    {props.isAdmin ? <TableCell align="right"><Button onClick={() => { handleDelete(user.id) }}>X</Button></TableCell> : null}
                                    {props.isAdmin ? <TableCell align="right"><Button onClick={() => { editEntry(user.id) }}>EDIT</Button></TableCell> : null}

                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>
            </TableContainer>
            <Modal isOpen={editMode}>
                <label>username: </label>
                <TextField name="username" value={userToEdit.username} onChange={(ev) => { handleEditChange(ev) }}></TextField>
                <br />
                <label>password: </label>
                <TextField name="password" value={userToEdit.password} onChange={(ev) => { handleEditChange(ev) }} ></TextField>
                <br />
                <label>name: </label>
                <TextField name="name" value={userToEdit.name} onChange={(ev) => { handleEditChange(ev) }} ></TextField>
                <br />
                <label>age: </label>
                <TextField name="age" value={userToEdit.age} onChange={(ev) => { handleEditChange(ev) }} ></TextField>
                <br />
                <label>email: </label>
                <TextField name="email" value={userToEdit.email} onChange={(ev) => { handleEditChange(ev) }} ></TextField>
                <br />
                <label>is admin: </label>
                <Checkbox name="isAdmin" checked={userToEdit.isAdmin == 0 ? false : true} onChange={(ev) => { handleAdminEdit(ev) }} ></Checkbox>
                <br />
                <Button onClick={() => { submitEdit() }}>submit</Button>
                <Button onClick={() => { seteditMode(false) }}>dismiss</Button>
            </Modal>
            <Modal isOpen={addMode}>
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

                <Button onClick={() => { submitRegister() }}>Add</Button>
                <Button onClick={() => { setaddMode(false) }}>dismiss</Button>

            </Modal>
        </React.Fragment>
    )

}

export default UserView