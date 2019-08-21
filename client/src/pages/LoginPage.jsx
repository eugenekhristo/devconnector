import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { SubmissionError } from 'redux-form';
import { selectAuth } from '../redux/resources/auth/auth.selectors';
import LoginForm from '../components/forms/login-form/LoginForm';
import { setAuthToken } from '../redux/resources/auth/auth.utils';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL
} from './../redux/resources/auth/auth.types';

const LoginPage = ({ dispatch, auth }) => {
  const handleSubmit = async values => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify(values);

    try {
      const {
        data: { user },
        headers
      } = await axios.post('/api/auth/login', body, config);

      const payload = {
        user: { ...user },
        jwt: headers['x-auth-token']
      };

      localStorage.setItem('jwt', payload.jwt);
      setAuthToken(localStorage.jwt);

      dispatch({
        type: LOGIN_SUCCESS,
        payload
      });
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL
      });
      throw new SubmissionError({ email: error.response.data.errors[0].msg });
    }
  };

  if (auth.isLoading) return null;

  if (auth.isAuthenticated) return <Redirect to="/dashboard" />;

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Login into Your Account
      </p>
      <LoginForm onSubmit={handleSubmit} />
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

LoginPage.propTypes = {
  // loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
  auth: selectAuth
});

export default connect(mapStateToProps)(LoginPage);
