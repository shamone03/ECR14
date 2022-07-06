import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter,
    Routes,
    Outlet,
    Route,
} from "react-router-dom";
import App from './App';
import Login from "./components/Login";
import Register from "./components/register/Register";
import Home from "./components/Home";
import VerifyEmailLink from "./components/VerifyEmailLink";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import VoteMenu from "./components/vote/VoteMenu";
import Survey from "./components/survey/Survey";
import Construction from "./components/utils/Construction";
import Settings from "./components/profile/Settings";
import ResetPassword from "./components/ResetPassword";
import NavBar from "./components/NavBar";
import Nominate from "./components/vote/Nominate";
import Voting from "./components/vote/Voting";
import '../node_modules/react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render (
    <React.StrictMode>
        <ToastContainer/>
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<App/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/register'} element={<Register/>}/>
                <Route path={'/client/:id/verify/:token'} element={<VerifyEmailLink/>}/>
                <Route path={'/client/:id/reset/:token'} element={<ResetPassword/>}/>
                <Route element={<>
                        <NavBar/>
                        <Outlet/>
                    </>}>
                    <Route path={'/home'} element={<Home/>}/>
                    <Route path={'/vote'} element={<VoteMenu/>}/>
                    <Route path={'/profile'} element={<Settings/>}/>
                    <Route path={'/vote/vote-now'} element={<Voting/>}/>
                    <Route path={'/vote/nominate'} element={<Nominate/>}/>
                    <Route path={'/survey'} element={<Survey/>}/>
                    <Route path={'/construction'} element={<Construction/>}/>
                </Route>
            </Routes>

        </BrowserRouter>
    </React.StrictMode>
)