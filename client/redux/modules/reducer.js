import { combineReducers } from 'redux-immutable';

import { createReducer } from '../../helpers/utils';
import { reducers } from './app';

export default combineReducers({
  notification: createReducer('notification', reducers.notification, []),
  globalVar: createReducer('globalVar', reducers.globalVar, {
    authToken: sessionStorage.getItem('token')
  }),
});
