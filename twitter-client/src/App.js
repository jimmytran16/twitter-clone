import './App.css';
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
    <div className="App">
      <Router>
        <Nav variant="tabs" defaultActiveKey="/home">
          <Nav.Item>
            <Nav.Link >
              <Link to="/"> Home </Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">
              <Link to="/dashboard">Dashboard</Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">
              <Link to="/profile"> Profile </Link>
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Switch>
          <Route path="/profile" component={ProfileComponent} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/" component={LandingComponent} />
        </Switch>
      </Router>


    </div>
  );
}

export default App;
