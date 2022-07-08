import React, { useState } from "react"
import ReactHlsPlayer from 'react-hls-player'

function DashBoard() {

    const [username, setUsername] = useState('')
    const playerRef: any = React.useRef();

    React.useEffect(() => {
        fetch("http://localhost:3000/success", {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setUsername(data.displayName)
            })
            .catch(err => console.log(err))
    })

    let message: string = (username)
        ? `hi there: ${username}` : 'not logged in!';

    return (
        <div className="App">
            <h1>Dashboard</h1>
            <p>{message}</p>
            <ReactHlsPlayer
                playerRef={playerRef}
                src="http://localhost:8080/hls/test.m3u8"
                autoPlay={true}
                controls={true}
                width="100%"
                height="auto"
            />
        </div>
    );
}

export default DashBoard;
