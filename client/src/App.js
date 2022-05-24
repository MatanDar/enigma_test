import './App.css';
import Home from './components/Home';

import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

function App() {

  let [socket, setsocket] = useState(null)

  useEffect(() => {

    const newSocket = socketIOClient("http://127.0.0.1:3000")
    setsocket(newSocket)

    newSocket.on("", () => {



    })

    return () => { newSocket.disconnect() }

  }, [])

  return (
    <div>
      <Home socket={socket}></Home>
    </div>
  );
}

export default App;
