import type { NextPage } from 'next'
import React, { useState } from "react"
import styles from '../styles/Home.module.css'

const DashBoard: NextPage = () => {

    let [latitude, setLatitude] = useState(0)
    let [longitude, setLongitude] = useState(0)
    const [username, setUsername] = useState('')

    function location() {


        navigator.geolocation.getCurrentPosition(position => {

            latitude = position.coords.latitude
            longitude = position.coords.longitude
            setLatitude(latitude)
            setLongitude(longitude)

            fetch("http://localhost:3000/location", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: latitude,
                    longitude: longitude,
                    displayName: username
                })
            })
                .then((res) => console.log("res: " + res))
                .catch((err) => console.log('error: ' + err))
        }, err => alert(err.message), { enableHighAccuracy: true, maximumAge: 10000 })

    }

    function locationUpdate() {
        setInterval(location, 1000)
    }

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
            <button onClick={() => locationUpdate()}>location</button>
            <p>{message}</p>
            <p>Longitude: {longitude}</p>
            <p>Latitude: {latitude}</p>
        </div>
    )
}

export default DashBoard
