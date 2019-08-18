import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../redux/resources/alert/alert.actions';
import { selectAuth } from '../redux/resources/auth/auth.selectors';
import { registerUser } from './../redux/resources/auth/auth.actions';
import { createStructuredSelector } from 'reselect';

const RegisterPage = ({ setAlert, registerUser, auth }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const handleChange = ({ target: { name, value } }) =>
    setFormData({ ...formData, [name]: value });

  const handleSubmit = async e => {
    e.preventDefault();
    const { name, email, password } = formData;
    if (password !== password2) return setAlert("Passwords don't match");
    registerUser({ name, email, password });
  };

  if (auth.isLoading) return null;

  if (auth.isAuthenticated) return <Redirect to="/dashboard" />;

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form
        className="form"
        action="create-profile.html"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            value={name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={handleChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

RegisterPage.propTypes = {
  setAlert: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  auth: selectAuth
});

export default connect(
  mapStateToProps,
  { setAlert, registerUser }
)(RegisterPage);
