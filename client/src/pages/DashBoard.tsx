import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import ReactHlsPlayer from 'react-hls-player';

function DashBoard() {

    const [username, setUsername] = useState('')
    const [key, setKey] = useState('')

    const playerRef: any = React.useRef();

    const url = "http://localhost:8080/hls/test.m3u8"

    React.useEffect(() => {

        fetch("http://localhost:4000/success", {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setUsername(data.displayName)
            })
            .catch(err => console.log(err))
    })

    function getKey() {
        fetch("http://localhost:4000/key", {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setKey(data)
            })
            .catch(err => console.log(err))
    }

    let message: string = (username)
        ? `hi there: ${username}` : 'not logged in!';

    return (
        <div className="App" style={{
            padding: '50px 0px 0px 370px'
        }}>
            <Sidebar />
            <Outlet />
            <h1>Dashboard</h1>
            <button onClick={getKey}>key</button>
            <p>Stream Key: test?key={key} </p>
            <p>{message}</p>
            <ReactHlsPlayer
                playerRef={playerRef}
                src={url}
                controls={true}
                autoPlay={true}
                height="100%"
                width="90%"
                hlsConfig={{
                    autoStartLoad: true,
                  }}
            />,
            <video src={url}></video>

        </div>
    );
}

export default DashBoard;
