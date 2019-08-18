import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar';
import Alert from './components/Alert';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

const App = () => (
  <Fragment>
    <Navbar />
    <Route exact path="/" component={LandingPage} />
    <section className="container">
      <Alert />
      <Switch>
        <Route path="/register" component={RegisterPage} />
        <Route path="/login" component={LoginPage} />
      </Switch>
    </section>
  </Fragment>
);

export default App;
