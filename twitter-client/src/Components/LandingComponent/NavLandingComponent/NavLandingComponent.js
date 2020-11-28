import React from 'react'
import './style.css'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons'



function NavLandingComponent() {
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
                <Button className="sign-up-nav-btn">Sign up</Button>
                <Button className="login-nav-btn">Log in</Button>
            </div>
        </>

    )
}

export default NavLandingComponent;