import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectAuth } from './../../redux/resources/auth/auth.selectors';

const ProtectedRoute = ({
  component: Component,
  auth: { isLoading, isAuthenticated },
  ...restProps
}) => {
  return (
    <Route
      {...restProps}
      render={() =>
        !isAuthenticated && !isLoading ? (
          <Redirect to="/login" />
        ) : (
          <Component />
        )
      }
    />
  );
};

ProtectedRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = createStructuredSelector({
  auth: selectAuth
});

export default connect(mapStateToProps)(ProtectedRoute);
