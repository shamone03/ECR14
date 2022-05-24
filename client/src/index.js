import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import App from './App';
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import VerifyEmailLink from "./components/VerifyEmailLink";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Voting from "./components/Voting";
import Survey from "./components/Survey";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render (
    <BrowserRouter>
        <Routes>
            <Route path={'/'} element={<App/>}/>
            <Route path={'/login'} element={<Login/>}/>
            <Route path={'/register'} element={<Register/>}/>
            <Route path={'/home'} element={<Home/>}/>
            <Route path={'/vote'} element={<Voting/>}/>
            <Route path={'/survey'} element={<Survey/>}/>
            <Route path={'/:id/verify/:token'} element={<VerifyEmailLink/>}/>
        </Routes>

    </BrowserRouter>
)