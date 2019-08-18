import axios from 'axios';
import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  AUTH_FAIL,
  AUTH_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS
} from './auth.types';
import { setAlert } from '../alert/alert.actions';
import { setAuthToken } from './auth.utils';

export const authUser = () => async dispatch => {
  setAuthToken(localStorage.jwt);
  try {
    const {
      data: { user }
    } = await axios.get('/api/auth');
    dispatch({ type: AUTH_SUCCESS, payload: user });
  } catch (error) {
    dispatch({ type: AUTH_FAIL });
  }
};

export const loginUser = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

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
    error.response.data.errors.forEach(error => dispatch(setAlert(error.msg)));
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const registerUser = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const {
      data: { user },
      headers
    } = await axios.post('/api/users', body, config);

    const payload = {
      user,
      jwt: headers['x-auth-token']
    };

    localStorage.setItem('jwt', payload.jwt);
    setAuthToken(localStorage.jwt);

    dispatch({
      type: REGISTER_SUCCESS,
      payload
    });
  } catch (error) {
    error.response.data.errors.forEach(error => dispatch(setAlert(error.msg)));
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwt');
  dispatch({ type: LOGOUT });
};
