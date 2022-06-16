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
import VoteMenu from "./components/VoteMenu";
import Survey from "./components/Survey";
import Admin from "./components/Admin";
import Construction from "./components/Construction";
import Voting from "./components/Voting";
import Settings from "./components/Settings";
import ResetPassword from "./components/ResetPassword";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render (
    <BrowserRouter>
        <Routes>
            <Route path={'/'} element={<App/>}/>
            <Route path={'/login'} element={<Login/>}/>
            <Route path={'/register'} element={<Register/>}/>
            <Route path={'/home'} element={<Home/>}/>
            {/*<Route path={'/admin'} element={<Admin/>}/>*/}
            <Route path={'/vote'} element={<VoteMenu/>}/>
            <Route path={'/settings'} element={<Settings/>}/>
            <Route path={'/vote/vote-now'} element={<Voting/>}/>
            <Route path={'/survey'} element={<Survey/>}/>
            <Route path={'/verify/:id/verify/:token'} element={<VerifyEmailLink/>}/>
            <Route path={'/reset/:id/reset/:token'} element={<ResetPassword/>}/>
            <Route path={'/construction'} element={<Construction/>}/>
        </Routes>

    </BrowserRouter>
)