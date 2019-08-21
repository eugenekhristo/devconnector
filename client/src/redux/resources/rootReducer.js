import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import alerts from './alert/alert.reducer';
import auth from './auth/auth.reducer';

export default combineReducers({ alerts, auth, form: formReducer });
