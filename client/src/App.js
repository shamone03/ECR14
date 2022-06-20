import './App.css';
import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom"
import styles from './css/App.module.css'
import {Button, Dropdown, DropdownButton, Offcanvas} from "react-bootstrap";
import { useMediaQuery } from 'react-responsive'
import {
    AiOutlineClose,
    AiOutlineMenu,
    FaVoteYea,
    GoReport,
    IoDocumentsOutline,
    RiSurveyLine
} from "react-icons/all";

function App() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 600px)' })
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()

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
                                    <Dropdown.Item onClick={() => navigate('/login')}>Voting</Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/login')}>Events</Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/login')}>Documents</Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/login')}>Amenities</Dropdown.Item>
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
        <div className={`App`}>
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
                                    <Dropdown.Item onClick={() => navigate('/login')}>Voting</Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/login')}>Events</Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/login')}>Documents</Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/login')}>Amenities</Dropdown.Item>
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
            <div className={`${styles.backgroundImg} d-flex align-items-center flex-column`}>
                <div className={`text-center ${styles.title}`}>
                    <h1 style={{color: 'lightblue'}}>ECR 14</h1>
                    <Button onClick={() => navigate('/register')}>Start your journal</Button>
                </div>
                <div className={`container ${styles.containerStyle}`}>
                    <div className={'row'}>
                        <div className={`col-lg-3 col-md-6 ${styles.cardStyle}`}>
                            <div className={`${styles.innerCard}`}>
                                <FaVoteYea size={70}/>
                                <h4 className={'mt-3'}><Link className={`${styles.linkStyle}`} to={'/login'}>Voting System</Link></h4>
                                <p className={`${styles.description}`}>Allows the residents to vote for electing their association representatives</p>
                            </div>

                        </div>
                        <div className={`col-lg-3 col-md-6 ${styles.cardStyle}`}>
                            <div className={`${styles.innerCard}`}>
                                <RiSurveyLine size={70}/>
                                <h4 className={'mt-3'}><Link className={`${styles.linkStyle}`} to={'/survey'}>Survey</Link></h4>
                                <p className={`${styles.description}`}>Create the survey for questions raised by different association representatives</p>
                            </div>

                        </div>
                        <div className={`col-lg-3 col-md-6 ${styles.cardStyle}`}>
                            <div className={`${styles.innerCard}`}>
                                <IoDocumentsOutline size={70}/>
                                <h4 className={'mt-3'}><Link className={`${styles.linkStyle}`} to={'/login'}>Management</Link></h4>
                                <p className={`${styles.description}`}>Inventory, Finance and Payroll management</p>
                            </div>
                        </div>
                        <div className={`col-lg-3 col-md-6 ${styles.cardStyle}`}>
                            <div className={`${styles.innerCard}`}>
                                <GoReport size={70}/>
                                <h4 className={'mt-3'}><Link className={`${styles.linkStyle}`} to={'/login'}>Compliance</Link></h4>
                                <p className={`${styles.description}`}>Compliance issues can be raised</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles.about}`} id={'about'}>
                <div className={`container`}>
                    <div className={`${styles.aboutTitle}`}>
                        <h1 style={{color: 'lightblue'}}>ECR14</h1>
                        <h3><span style={{color: 'lightblue'}}>ECR14</span> Community</h3>
                    </div>
                    <div className={'container'}>
                        <div className={'row'}>
                            <div className={'col-lg-12 pt-4 pt-lg-0'}>
                                <p>
                                    Ever afters amidst of Beaufort scale of wind, ECR 14 is progressing towards all ever afters. Best of residential amenities, family neighbours and it’s happening place always for 577 families. Younger ones can enrich themselves through play, digital games, gym, swimming, board games, and a library to be part of ‘What a Wonderful world’. The best of the intellectuals from the community guides every way of living through all seasons/celebrations. Wiser ones with age can find exceptional quality of life around them. It is always admirable about the spirit of the community leads a life together. We are happy to welcome you to ECR 14, Start your Journal here!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className={`${styles.footer}`}>
                <div>
                    <div className={'container'}>
                        <div className={'row'}>
                            <div className={'col-lg-3 col-md-6'}>
                                <h3 style={{color: 'lightblue'}}>ECR14</h3>
                                <p>
                                    Maya Street <br/>
                                    Reddy Kuppam, Kanathur<br/>
                                    Kanchipuram
                                    <br/>
                                    <br/>
                                    <strong>Phone:</strong> +91 99999999<br/>
                                    <strong>Email:</strong> ecr14.org@gmail.com<br/>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>

                </div>
            </footer>



        </div>

    )
}

export default App;
