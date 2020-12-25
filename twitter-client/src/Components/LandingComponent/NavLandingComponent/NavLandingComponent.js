import React, { useState } from 'react'
import './style.css'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons'
import RegisterForm from '../Modals/RegisterForm/RegisterForm'
import LoginFormModal from '../Modals/LoginForm/LoginFormModal'


/**
 * Componenet function that represents the login and sign up navigation
*/
function NavLandingComponent() {
    const [show, setShow] = useState(false);
    const [showLogin,setShowLogin] = useState(false)

    return (
        <>
            <div className="nav-landing-wrapper">
                <div className="twitter-message-container">
                    <div className="icon-container">
                        <FontAwesomeIcon icon={faTwitterSquare} size="3x" />
                    </div>
                    <h3> See what's happening in the world right now</h3>
                    <p className="">Join Twitter today.</p>
                </div>
                <Button onClick={() => setShow(!show)} className="sign-up-nav-btn">Sign up</Button>
                <Button onClick={() => setShowLogin(!showLogin)} className="login-nav-btn">Log in</Button>
            </div>
            <LoginFormModal show={showLogin} />
            <RegisterForm show={show}/>
        </>

    )
}


export default NavLandingComponent;