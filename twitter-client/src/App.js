import LandingComponent from './Components/LandingComponent/LandingComponent'
import Dashboard from './Components/DashboardComponent/DashboardComponent'
import ProfileComponent from './Components/ProfileComponent/ProfileComponent'
import UserNavigationComponent from './Components/UserNavigationComponent/UserNavigationComponent'
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css'

import ThreadComponent from './Components/ThreadComponent/ThreadComponent'

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/profile"> 
            <UserNavigationComponent />
            <ProfileComponent />
          </Route>
          <Route path="/dashboard" > 
          <UserNavigationComponent />
            <Dashboard />
          </Route>
          <Route path="/thread/:id" component={ThreadComponent}/>
          <Route path="/" component={LandingComponent} />
        </Switch>
      </Router>
    </>
  );
}


export default App;
