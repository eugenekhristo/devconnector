import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  AUTH_FAIL,
  AUTH_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS
} from './auth.types';

const INITIAL_STATE = {
  jwt: localStorage.getItem('jwt'),
  isLoading: true,
  isAuthenticated: false,
  user: null
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: payload
      };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        jwt: payload.jwt,
        isLoading: false,
        isAuthenticated: true,
        user: payload.user
      };

    case LOGIN_FAIL:
    case LOGOUT:
    case AUTH_FAIL:
    case REGISTER_FAIL:
      return {
        ...state,
        jwt: '',
        isLoading: false,
        isAuthenticated: false,
        user: null
      };

    default:
      return state;
  }
};
