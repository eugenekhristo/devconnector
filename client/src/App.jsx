import React, { Fragment, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.scss';
import Navbar from './components/Navbar';
import Alert from './components/Alert';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { authUser } from './redux/resources/auth/auth.actions';

const App = ({ authUser }) => {
  useEffect(() => {
    authUser();
  }, [authUser]);

  return (
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
};

export default connect(
  null,
  { authUser }
)(App);
