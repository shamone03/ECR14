import logo from './logo.svg';
import './App.css';
import React, { Component }  from 'react';
import { Link } from "react-router-dom"
import {useEffect, useState} from "react"

function App() {



    return (
        <div className="App">
            <h1>{'ECR14'}</h1>
            <nav>
                <Link to={'/home'}>Home</Link>
                <Link to={'/login'}>Login</Link>
                <Link to={'/register'}>Register</Link>
            </nav>
        </div>
    );
}

export default App;
