import LandingComponent from './Components/LandingComponent/LandingComponent'
import Dashboard from './Components/DashboardComponent/DashboardComponent'
import ProfileComponent from './Components/ProfileComponent/ProfileComponent'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBell, faUser, faCog } from '@fortawesome/free-solid-svg-icons'
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons'
import logoutUser from './Helpers/helpers'
import { Nav, Dropdown } from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css'

const NAV_COMPONENT = () => {
  return (
    <Nav hidden={false} variant="tabs" defaultActiveKey="/home">
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

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/profile"> 
            <NAV_COMPONENT />
            <ProfileComponent />
          </Route>
          <Route path="/dashboard" > 
          <NAV_COMPONENT />
            <Dashboard />
          </Route>
          <Route path="/" component={LandingComponent} />
        </Switch>
      </Router>
    </>
  );
}

const linkStyle = {
  color: '#08a0e9',
  fontWeight: 'bolder'
}

export default App;
