import type { NextPage } from 'next'
import React, { useState } from "react"
import styles from '../styles/Home.module.css'

const Upload: NextPage = () => {


    return (
        <div className={styles.container}>
            <div className="container">
                <div className="row">
                    <form>
                        <h3>React File Upload</h3>
                        <div className="form-group">
                            <input type="file" />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary" type="submit">Upload</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Upload
