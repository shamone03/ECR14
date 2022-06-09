import {useMediaQuery} from "react-responsive";
import React, {useState} from "react";
import {Button, Dropdown, Offcanvas} from "react-bootstrap";
import styles from "../css/App.module.css";
import {AiOutlineClose, AiOutlineMenu} from "react-icons/all";
import {Link} from "react-router-dom";

const NavBar = () => {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' })
    const [showMenu, setShowMenu] = useState(false)

    const MobileMenu = () => {
        console.log('tre')
        return (
            <Offcanvas onHide={() => setShowMenu(false)} show={showMenu} style={{backgroundColor: '#161b22'}}>
                <Offcanvas.Header>
                    <Offcanvas.Title>
                        Menu
                    </Offcanvas.Title>
                    <Button variant={`outline-light ${styles.closeButtonStyle}`} onClick={() => setShowMenu(false)}><AiOutlineClose size={25}/></Button>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className={'d-flex flex-column h-100'}>
                        <div className={'text-center'}>
                            <Dropdown>
                                <Dropdown.Toggle className={`btn my-3 ${styles.buttonStyle}`}>
                                    Tools
                                </Dropdown.Toggle>
                                <Dropdown.Menu variant={'dark'}>
                                    <Dropdown.Item href="/login">Voting</Dropdown.Item>
                                    <Dropdown.Item href="/login">Events</Dropdown.Item>
                                    <Dropdown.Item href="/login">Documents</Dropdown.Item>
                                    <Dropdown.Item href="/login">Amenities</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <a className={`${styles.linkStyle} my-3 btn ${styles.buttonStyle}`} href={'mailto:ecr14.ecr14@gmail.com'}>Contact</a>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        )
    }

    return (
        <nav className={`d-flex flex-row justify-content-between ${styles.navBar} align-items-center`}>
            <h2 className={'mx-3 my-3'} style={{color: 'lightblue'}}>ECR14</h2>
            <div className={`d-flex flex-row justify-content-end align-items-center`}>
                {showMenu ? (<MobileMenu/>) : (<></>)}
                {isTabletOrMobile ? (
                    <>
                        <div className={'d-flex justify-content-end'}>
                            <div className={'d-flex flex-row justify-content-center align-items-center'}>
                                <Link to={'/login'} className={`${styles.linkStyle} my-3 btn ${styles.buttonStyle}`}>Login</Link>
                                <Link to={'/register'} className={'my-3 mx-3 btn btn-outline-light'}>Register</Link>
                            </div>
                            <Button onClick={() => setShowMenu(true)} className={styles.menuButtonStyle}><AiOutlineMenu size={25}/></Button>
                        </div>
                    </>

                ) : (
                    <>
                        <Dropdown>
                            <Dropdown.Toggle className={`btn my-3 ${styles.buttonStyle}`}>
                                Tools
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant={'dark'}>
                                <Dropdown.Item href="/construction">Voting</Dropdown.Item>
                                <Dropdown.Item href="/construction">Events</Dropdown.Item>
                                <Dropdown.Item href="/construction">Documents</Dropdown.Item>
                                <Dropdown.Item href="/construction">Amenities</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <a className={`${styles.linkStyle} my-3 mx-1 btn ${styles.buttonStyle}`} href={'mailto:ecr14.ecr14@gmail.com'}>Contact</a>
                        <div className={'d-flex justify-content-end align-items-center'}>
                            <Link to={'/login'} className={`${styles.linkStyle} my-3 btn ${styles.buttonStyle}`}>Login</Link>
                            <Link to={'/register'} className={'my-3 mx-3 btn btn-outline-light'}>Register</Link>
                        </div>
                    </>
                )}


            </div>

        </nav>
    )
}