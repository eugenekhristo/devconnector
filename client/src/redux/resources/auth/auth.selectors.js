import { createSelector } from 'reselect';

const _selectAuth = state => state.auth;

export const selectAuth = createSelector(
  [_selectAuth],
  auth => auth
);

export const selectIsAuthenticated = createSelector(
  [_selectAuth],
  auth => auth.isAuthenticated
);
