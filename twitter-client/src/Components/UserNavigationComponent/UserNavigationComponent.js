import React, { useState } from 'react'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBell, faUser, faCog } from '@fortawesome/free-solid-svg-icons'
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons'
import { clearLocalStorageData } from '../../Helpers/helpers'
import { Nav, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

//  Nav component for authenticarted users ONLY
export default function UserNavigationComponent() {
  const [active, setActive] = useState("home-tab")
  return (
    <>
      {
        (localStorage.getItem('user'))
          ? (<Nav style={{ padding: '5px 0px', justifyContent: 'space-between', maxWidth: '1140px', paddingRight: '15px', paddingLeft: '15px', margin: '0px auto' }} hidden={false} variant="tabs" defaultActiveKey="/home">
            <Nav.Item style={(active === 'home-tab') ? activeStyling : {}} onClick={() => setActive('home-tab')} >
              <Nav.Link style={linkStyle} as={Link} to="/">
                <FontAwesomeIcon icon={faHome} /> Home
              </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item style={(active === 'notification-tab') ? activeStyling : {}} onClick={() => setActive('notification-tab')} >
              <Nav.Link style={linkStyle} as={Link} to="/" >
                <FontAwesomeIcon icon={faBell} /> Notifications
              </Nav.Link>
            </Nav.Item> */}
            <Nav.Item style={(active === 'profile-tab') ? activeStyling : {}} onClick={() => setActive('profile-tab')} value="profile-tab">
              <Nav.Link style={linkStyle} as={Link} to="/profile" >
                <FontAwesomeIcon icon={faUser} /> Profile
              </Nav.Link>
            </Nav.Item>
            <div className="dropdown-icon-container">
              <Dropdown>
                <Dropdown.Toggle style={{ borderColor: 'white', backgroundColor: 'unset', color: 'rgb(8, 160, 233)' }} variant="success" id="dropdown-basic">
                  <FontAwesomeIcon icon={faCog} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={clearLocalStorageData}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ padding: '0px 7px', textTransform: 'capitalize' }}>Welcome, {JSON.parse(localStorage.getItem('user')).name}</span>
                <FontAwesomeIcon style={{ float: 'right' }} color="rgb(8, 160, 233)" size="2x" icon={faTwitterSquare} />
              </div>
            </div>
          </Nav>)
          : (<span>ERROR RENDERING NAV BAR</span>)
      }
    </>
  )
}

// style for when the nav menu is active
const activeStyling = { backgroundColor: 'rgb(240, 240, 240)' }

const linkStyle = {
  color: '#08a0e9',
  fontWeight: 'bolder'
}