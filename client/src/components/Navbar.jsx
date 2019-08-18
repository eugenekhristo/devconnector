import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAuth } from '../redux/resources/auth/auth.selectors';
import { createStructuredSelector } from 'reselect';
import { logoutUser } from '../redux/resources/auth/auth.actions';

const Navbar = ({ auth, logoutUser }) => {
  const itemsForGuests = (
    <ul>
      <li>
        <Link to="#!">Developers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  const itemsForAuthenticated = (
    <ul>
      <li>
        <Link to="#!">Developers</Link>
      </li>
      <li onClick={() => logoutUser()}>
        <Link to="/login">
          <i className="fas fa-sign-out-alt" /> Logout
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code" /> DevConnector
        </Link>
      </h1>
      {!auth.isLoading &&
        (auth.isAuthenticated ? itemsForAuthenticated : itemsForGuests)}
    </nav>
  );
};

const mapStateToProps = createStructuredSelector({
  auth: selectAuth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
