import LandingComponent from './Components/LandingComponent/LandingComponent'
import Dashboard from './Components/DashboardComponent/DashboardComponent'
import ProfileComponent from './Components/ProfileComponent/ProfileComponent'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav } from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Nav variant="tabs" defaultActiveKey="/home">
          <Nav.Item>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/dashboard" >
              Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/profile" >
              Profile
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Switch>
          <Route path="/profile" component={ProfileComponent} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/" component={LandingComponent} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
