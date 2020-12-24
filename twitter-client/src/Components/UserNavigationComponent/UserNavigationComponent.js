import React from 'react'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBell, faUser, faCog } from '@fortawesome/free-solid-svg-icons'
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons'
import logoutUser from '../../Helpers/helpers'
import { Nav, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

//  Nav component for authenticarted users ONLY
export default function UserNavigationComponent() {
    return (
        <Nav style={{padding:'5px 0px'}} hidden={false} variant="tabs" defaultActiveKey="/home">
              <Nav.Item>
                <Nav.Link style={linkStyle} as={Link} to="/">
                  <FontAwesomeIcon icon={faHome} /> Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link style={linkStyle} as={Link} >
                  <FontAwesomeIcon icon={faBell} /> Notifications
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link style={linkStyle} as={Link} to="/profile" >
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Nav.Link>
              </Nav.Item>
              <div className="dropdown-icon-container">
              <Dropdown>
                <Dropdown.Toggle style={{borderColor:'white',backgroundColor:'unset', color: 'rgb(8, 160, 233)'}} variant="success" id="dropdown-basic">
                  <FontAwesomeIcon icon={faCog} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={logoutUser}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
                <FontAwesomeIcon style={{ float: 'right' }} color="rgb(8, 160, 233)" size="2x" icon={faTwitterSquare} />
              </div>
            </Nav>
      )
}

const linkStyle = {
    color: '#08a0e9',
    fontWeight: 'bolder'
}