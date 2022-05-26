import LoginOrReg from "./LogOrReg"
import Userview from "./UserView"
import React, { useState, useEffect } from "react";


function Home() {

    let [isLogged, setisLogged] = useState(false)
    let [isAdmin, setisAdmin] = useState(false)
    let [users, setusers] = useState([])


    useEffect(async () => {

        fetchUsers()

    }, [])

    async function fetchUsers() {

        const res = await fetch("/allusers")
        const data = await res.json()

        console.log(data);
        setusers(data)

    }

    if (isLogged) {
        return <Userview fetchUsers={fetchUsers} isAdmin={isAdmin} users={users} setisLogged={setisLogged} ></Userview>

    }
    else {
        return <LoginOrReg fetchUsers={fetchUsers} setisAdmin={setisAdmin} setisLogged={setisLogged}></LoginOrReg>
    }

}

export default Home