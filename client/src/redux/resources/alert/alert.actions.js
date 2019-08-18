import uuid from 'uuid/v4';
import { SET_ALERT, REMOVE_ALERT } from './alert.types';

export const setAlert = (
  message,
  type = 'danger',
  timeout = 5000
) => dispatch => {
  const id = uuid();

  dispatch({
    type: SET_ALERT,
    payload: {
      id,
      message,
      type
    }
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
