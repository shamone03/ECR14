import './App.css';
import React from 'react';
import { Link } from "react-router-dom"
import styles from './css/App.module.css'
import {Button, Dropdown, DropdownButton} from "react-bootstrap";
import { useMediaQuery } from 'react-responsive'

function App() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' })

    return (
        <div className={`App`}>
            <nav className={`d-flex flex-row justify-content-between ${styles.navBar} align-items-center`}>
                <h2 className={'mx-3 my-3'} style={{color: 'lightblue'}}>ECR14</h2>
                <div className={`d-flex flex-row justify-content-end align-items-center`}>
                    {isTabletOrMobile ? (<Button>Menu</Button>) : (
                        <>
                            <Dropdown>
                                <Dropdown.Toggle className={`btn my-3 ${styles.buttonStyle}`}>
                                    Tools
                                </Dropdown.Toggle>

                                <Dropdown.Menu variant={'dark'}>
                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
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
            <div className={`${styles.backgroundImg} d-flex align-items-center flex-column justify-content-center`}>
                <div className={"text-center"}>
                    <h1 style={{fontSize: '56px', fontWeight: '600', color: 'red'}}>Site is under construction!</h1>
                    <h1 style={{color: 'lightblue'}}>ECR 14</h1>
                    <Button>Start your journal</Button>
                </div>
                <div className={'container'}>
                    <div className={'row'}>
                        <div className={'col-lg-3 col-md-6 border-dark border-1 align-content-stretch'}>
                            <h4><Link to={'/login'}>Voting System</Link></h4>
                        </div>
                        <div className={'col-lg-3 col-md-6 border-dark border-1 align-content-stretch'}>
                            <h4><Link to={'/login'}>Voting System</Link></h4>
                        </div>
                        <div className={'col-lg-3 col-md-6 border-dark border-1 align-content-stretch'}>
                            <h4><Link to={'/login'}>Voting System</Link></h4>
                        </div>
                        <div className={'col-lg-3 col-md-6 border-dark border-1 align-content-stretch'}>
                            <h4><Link to={'/login'}>Voting System</Link></h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'container'} style={{height: '1000px'}}>

            </div>



        </div>

    );
}

export default App;
