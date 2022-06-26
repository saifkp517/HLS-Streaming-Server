import type { NextPage } from 'next'
import React, { useState } from "react"
import { ReactMediaRecorder, useReactMediaRecorder } from 'react-media-recorder'
import styles from '../styles/Home.module.css'

const DashBoard: NextPage = () => {

    const [username, setUsername] = useState('')

    const {
        status,
        startRecording: startRecord,
        stopRecording: stopRecord,
        mediaBlobUrl
    } = useReactMediaRecorder({ screen: true, audio: false, video: false })

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
        <div className={styles.container}>
            <h1>Dashboard</h1>
            <p>{message}</p>
            <ReactMediaRecorder
                video
                render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                    <div>
                        <p>{status}</p>
                        <button onClick={startRecording}>Start Recording</button>
                        <button onClick={stopRecording}>Stop Recording</button>
                        <video src={mediaBlobUrl} controls autoPlay loop />
                    </div>
                )}
            />


        </div>
    )
}

export default DashBoard
