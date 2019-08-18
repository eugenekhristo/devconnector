import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectAlerts } from '../redux/resources/alert/alert.selectors';

const Alert = ({ alerts }) =>
  alerts.map(({ id, message, type }) => (
    <div key={id} className={`alert alert-${type}`}>
      {message}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = createStructuredSelector({
  alerts: selectAlerts
});

export default connect(mapStateToProps)(Alert);
