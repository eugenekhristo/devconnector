import { combineReducers } from 'redux';
import alerts from './alert/alert.reducer';
import auth from './auth/auth.reducer';

export default combineReducers({ alerts, auth });
