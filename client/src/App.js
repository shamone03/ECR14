import './App.css';
import React from 'react';
import { Link } from "react-router-dom"
import styles from './css/App.module.css'


function App() {

    return (
        <div className={'App'}>
            <nav className={'d-flex flex-column'}>
                <div className={'d-flex justify-content-end'}>
                    <Link to={'/login'} className={`${styles.linkStyle} my-3 mx-3 btn`}>Login</Link>
                    <Link to={'/register'} className={'my-3 mx-3 btn btn-outline-light'}>Register</Link>
                </div>
            </nav>
            <h1 className={`mb-5 ${styles.headingStyle}`}>ECR14</h1>

        </div>

    );
}

export default App;
