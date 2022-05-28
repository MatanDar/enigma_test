import LoginOrReg from "./LogOrReg"
import Userview from "./UserView"
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie"

function Home() {

    let [isLogged, setisLogged] = useState(false)
    let [isAdmin, setisAdmin] = useState(false)
    let [users, setusers] = useState([])

    let [checkingUser, setcheckingUser] = useState(true)

    useEffect(async () => {

        const logged = Cookies.get("logged")
        if (logged) {
            const res = await fetch('/tokenCheck', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: logged
                })
            })
            const data = await res.json()

            if (data.status == "success") {
                setisLogged(true)
                setisAdmin(data.isAdmin)
            }
            else if (data.status == "failed") {
                alert("bad details")
            }
            else { 
                alert("error try again")
            }
        }
        setcheckingUser(false)
    }, [])

    async function fetchUsers() {
        const res = await fetch("/allusers")
        const data = await res.json()
        setusers(data)
    }
    if (checkingUser) {
        return <label>LOADING !!!</label>
    }
    else {
        if (isLogged) {
            return <Userview fetchUsers={fetchUsers} isAdmin={isAdmin} users={users} setisLogged={setisLogged} ></Userview>

        }
        else {
            return <LoginOrReg fetchUsers={fetchUsers} setisAdmin={setisAdmin} setisLogged={setisLogged}></LoginOrReg>
        }
    }
}

export default Home