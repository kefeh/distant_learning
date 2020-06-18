import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

// import logo from './logo.svg';
import './stylesheets/App.css';
import FormView from './components/FormView';
import MainView from './components/MainView';
import Header from './components/Header';
import Login from './components/Login';
import Logout from "./components/Logout"
import Footer from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"


class App extends Component {
  render() {
    return (
    <div className="App">
      <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100&display=swap" rel="stylesheet"></link>
      <Header path />
      <Router>
        <Switch>
          <Route path="/" exact component={MainView} />
          <PrivateRoute path="/dashboard" component={FormView} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          {/* <PrivateRoute path="/Register" component={Register} /> */}
          <Route component={MainView} />
        </Switch>
      </Router>
      <Footer />
    </div>
  );

  }
}

export default App;
