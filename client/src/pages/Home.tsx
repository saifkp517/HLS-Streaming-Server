import React from 'react';
import Sidebar from "./components/Sidebar"
import { Outlet } from "react-router-dom"

function Home() {
    return (
        <div className="App" style={{
            padding: '50px 0px 0px 370px'
        }}>
            <Sidebar />
            <Outlet />
            <h1>Login using google</h1>
            <a href="http://localhost:4000/auth/google">Google Login</a>
        </div>
    );
}

export default Home;