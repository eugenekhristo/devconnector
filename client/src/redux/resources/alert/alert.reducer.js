import { SET_ALERT, REMOVE_ALERT } from './alert.types';

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case SET_ALERT:
      return [...state, payload];

    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);

    default:
      return state;
  }
};
