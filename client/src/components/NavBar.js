import {useMediaQuery} from "react-responsive";
import React, {useState} from "react";
import {Badge, Button, Dropdown, Offcanvas} from "react-bootstrap";
import styles1 from "../css/NavBar.module.css";
import {AiOutlineClose, AiOutlineMenu, FiLogOut} from "react-icons/all";
import {NavLink, useNavigate} from "react-router-dom";

const NavBar = () => {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' })
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()
    let activeClassName = styles1.linkActive
    let inActiveClassName = styles1.linkInActive
    const linkStyle = {
        fontSize: '1.5em'
    }

    const logout = () => {
        localStorage.clear()
        navigate('/')
    }

    const MobileMenu = () => {
        return (
            <Offcanvas onHide={() => setShowMenu(false)} show={showMenu} style={{backgroundColor: '#161b22'}}>
                <Offcanvas.Header>
                    <Offcanvas.Title>
                        Menu
                    </Offcanvas.Title>
                    <Button variant={`outline-light ${styles1.closeButtonStyle}`} onClick={() => setShowMenu(false)}><AiOutlineClose size={25}/></Button>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className={'d-flex flex-column h-100 justify-content-between'}>
                        <div className={'d-flex flex-column h-100 text-center'}>
                            <NavLink style={linkStyle} onClick={() => setShowMenu(false)} to={'/home'} className={({ isActive }) => isActive ? activeClassName : inActiveClassName}>Home</NavLink>
                            <NavLink style={linkStyle} onClick={() => setShowMenu(false)} to={'/vote'} className={({ isActive }) => isActive ? activeClassName : inActiveClassName}>Vote<Badge bg={'warning'} pill>WIP</Badge></NavLink>
                            <NavLink style={linkStyle} onClick={() => setShowMenu(false)} to={'/settings'} className={({ isActive }) => isActive ? activeClassName : inActiveClassName}>Profile</NavLink>
                            <Dropdown>
                                <Dropdown.Toggle className={`btn ${styles1.buttonStyle}`} style={linkStyle}>
                                    Tools
                                </Dropdown.Toggle>
                                <Dropdown.Menu variant={'dark'}>
                                    <Dropdown.Item className={styles1.dropDownItemStyle} style={linkStyle} onClick={() => {
                                        setShowMenu(false)
                                        navigate('/vote')
                                    }}>Voting</Dropdown.Item>
                                    <Dropdown.Item className={styles1.dropDownItemStyle} style={linkStyle} onClick={() => {
                                        setShowMenu(false)
                                        navigate('/construction')
                                    }}>Events</Dropdown.Item>
                                    <Dropdown.Item className={styles1.dropDownItemStyle} style={linkStyle} onClick={() => {
                                        setShowMenu(false)
                                        navigate('/construction')
                                    }}>Documents</Dropdown.Item>
                                    <Dropdown.Item className={styles1.dropDownItemStyle} style={linkStyle} onClick={() => {
                                        setShowMenu(false)
                                        navigate('/construction')
                                    }}>Amenities</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <Button variant={'outline-danger'} className={'mx-2'} onClick={logout}>Logout &nbsp;<FiLogOut size={'25'}/></Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        )
    }

    return (


        <nav className={`d-flex flex-row justify-content-between ${styles1.navBar} align-items-center`}>
            <div className={'d-flex flex-row justify-content-between align-items-center'}>
                <h2 className={'ms-3 my-3 d-inline'} style={{color: 'lightblue'}}>ECR14</h2>
                <p className={'d-inline my-3'} style={{fontSize: '15px'}}><Badge bg={'info'} pill>Beta</Badge></p>
            </div>
            <div className={`d-flex flex-row justify-content-end align-items-center`}>
                {showMenu ? (<MobileMenu/>) : (<></>)}
                {isTabletOrMobile ? (
                    <>
                        <Button onClick={() => setShowMenu(true)} className={styles1.menuButtonStyle}><AiOutlineMenu size={25}/></Button>
                    </>
                ) : (
                    <>
                        <Dropdown>
                            <Dropdown.Toggle className={`btn my-3 ${styles1.buttonStyle}`}>
                                Tools
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant={'dark'}>
                                <Dropdown.Item className={styles1.dropDownItemStyle} onClick={() => navigate('/vote')}>Voting</Dropdown.Item>
                                <Dropdown.Item className={styles1.dropDownItemStyle} onClick={() => navigate('/construction')}>Events</Dropdown.Item>
                                <Dropdown.Item className={styles1.dropDownItemStyle} onClick={() => navigate('/construction')}>Documents</Dropdown.Item>
                                <Dropdown.Item className={styles1.dropDownItemStyle} onClick={() => navigate('/construction')}>Amenities</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <NavLink to={'/home'} className={({ isActive }) => isActive ? activeClassName : inActiveClassName}>Home</NavLink>
                        <NavLink to={'/vote'} className={({ isActive }) => isActive ? activeClassName : inActiveClassName}>Vote<Badge bg={'warning'} pill>WIP</Badge></NavLink>
                        <NavLink to={'/settings'} className={({ isActive }) => isActive ? activeClassName : inActiveClassName}>Profile</NavLink>
                        <Button variant={'outline-danger'} className={'mx-2'} onClick={logout}><FiLogOut size={'25'}/></Button>
                    </>
                )}


            </div>

        </nav>
    )
}

export default NavBar