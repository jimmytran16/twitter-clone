import React, { useEffect } from 'react'
import './style.css'
import LoginForm from './LoginForm/LoginForm'
import NavLandingComponent from './NavLandingComponent/NavLandingComponent'
import { Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faUserFriends, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'

/**
  * Componenet function that represents the landing/main page of the website
*/ 
function LandingComponent() {
    const history = useHistory()
    useEffect(() => {
        if(localStorage['user']) {
            history.push('/dashboard')
        }
    })
    return (
        <>
            <div className="landing-main-wrapper">
                <Row style={rowStyle}>
                    <Col md={6} style={{padding:'unset'}}>
                        <div style={leftCol} className="left-column">
                            <div className="left-column-content">
                                <div className="container-icon-left">
                                    <FontAwesomeIcon icon={faSearch} size="2x" color="white" />
                                    <p>Follow your interests.</p>
                                </div>
                                <div className="container-icon-left">
                                    <FontAwesomeIcon icon={faUserFriends} size="2x" color="white" />
                                    <p>Hear what people are talking about.</p>
                                </div>
                                <div className="container-icon-left">
                                    <FontAwesomeIcon icon={faComment} size="2x" color="white" />
                                    <p>Join the conversation.</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={6} style={{padding:'unset'}} >
                        <div style={rightCol} className="right-column">
                            <LoginForm />
                            <NavLandingComponent />
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

// styles
const leftCol = {
    backgroundColor: '#08a0e9',
    width:'100%',
    height:'100vh'
}

const rightCol = {
    backgroundColor: '#292f33',
    width:'100%',
    height:'100%'
}

const rowStyle = {
    margin:'unset',
}

export default LandingComponent;