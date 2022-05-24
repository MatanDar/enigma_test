import LoginOrReg from "./LogOrReg"
import Userview from "./UserView"
import React, { useState, useEffect } from "react";


function Home(props) {

    let [isLogged, setisLogged] = useState(false)

    return (
        <div>
            {(() => {
                if (isLogged) {
                    return <Userview></Userview>
                }
                else {
                    return <LoginOrReg socket={props.socket} setisLogged={setisLogged}></LoginOrReg>
                }
            })()}
        </div>
    )
}

export default Home