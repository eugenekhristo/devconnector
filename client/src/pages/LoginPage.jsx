import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, Redirect } from 'react-router-dom';
import { loginUser } from '../redux/resources/auth/auth.actions';
import { selectAuth } from '../redux/resources/auth/auth.selectors';

const LoginPage = ({ loginUser, auth }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const handleChange = ({ target: { name, value } }) =>
    setFormData({ ...formData, [name]: value });

  const handleSubmit = async e => {
    e.preventDefault();
    loginUser(formData);
  };

  if (auth.isLoading) return null;

  if (auth.isAuthenticated) return <Redirect to="/dashboard" />;

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Login into Your Account
      </p>
      <form
        className="form"
        action="create-profile.html"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <input
            type="text"
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
            value={password}
            onChange={handleChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

LoginPage.propTypes = {
  loginUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = createStructuredSelector({
  auth: selectAuth
});

export default connect(
  mapStateToProps,
  { loginUser }
)(LoginPage);
