import { createSelector } from 'reselect';

const _selectAlerts = state => state.alerts;

export const selectAlerts = createSelector(
  [_selectAlerts],
  alerts => alerts
);
