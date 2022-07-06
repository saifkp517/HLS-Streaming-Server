import React, { useState } from "react"

function DashBoard() {

    const [username, setUsername] = useState('')

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
        </div>
    );
}

export default DashBoard;
