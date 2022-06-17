import {useMediaQuery} from "react-responsive";
import React, {useState} from "react";
import {Button, Dropdown, Nav, Navbar, Offcanvas} from "react-bootstrap";
import styles from "../css/App.module.css";
import styles1 from "../css/NavBar.module.css";
import {AiOutlineClose, AiOutlineMenu} from "react-icons/all";
import {Link, NavLink} from "react-router-dom";

const NavBar = () => {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' })
    const [showMenu, setShowMenu] = useState(false)
    let activeClassName = styles1.linkActive
    let inActiveClassName = styles1.linkInActive
    const linkStyle = {
        fontSize: '1.5em'
    }

    const MobileMenu = () => {
        return (
            <Offcanvas onHide={() => setShowMenu(false)} show={showMenu} style={{backgroundColor: '#161b22'}}>
                <Offcanvas.Header>
                    <Offcanvas.Title>
                        Menu
                    </Offcanvas.Title>
                    <Button variant={`outline-light ${styles.closeButtonStyle}`} onClick={() => setShowMenu(false)}><AiOutlineClose size={25}/></Button>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className={'d-flex flex-column h-100 text-center'}>
                        <NavLink style={linkStyle} onClick={() => setShowMenu(false)} to={'/home'} className={({ isActive }) => isActive ? activeClassName : inActiveClassName}>Home</NavLink>
                        <NavLink style={linkStyle} onClick={() => setShowMenu(false)} to={'/vote'} className={({ isActive }) => isActive ? activeClassName : inActiveClassName}>Vote</NavLink>
                        <NavLink style={linkStyle} onClick={() => setShowMenu(false)} to={'/settings'} className={({ isActive }) => isActive ? activeClassName : inActiveClassName}>Profile</NavLink>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        )
    }

    return (


        <nav className={`d-flex flex-row justify-content-between ${styles1.navBar} align-items-center`}>
            <h2 className={'mx-3 my-3'} style={{color: 'lightblue'}}>ECR14</h2>
            <div className={`d-flex flex-row justify-content-end align-items-center`}>
                {showMenu ? (<MobileMenu/>) : (<></>)}
                {isTabletOrMobile ? (
                    <Button onClick={() => setShowMenu(true)} className={styles.menuButtonStyle}><AiOutlineMenu size={25}/></Button>
                ) : (
                    <>
                        <NavLink to={'/home'} className={({ isActive }) => isActive ? activeClassName : inActiveClassName}>Home</NavLink>
                        <NavLink to={'/vote'} className={({ isActive }) => isActive ? activeClassName : inActiveClassName}>Vote</NavLink>
                        <NavLink to={'/settings'} className={({ isActive }) => isActive ? activeClassName : inActiveClassName}>Profile</NavLink>
                    </>
                )}


            </div>

        </nav>
    )
}

export default NavBar