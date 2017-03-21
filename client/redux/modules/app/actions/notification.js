import { SET_NOTIFICATION } from '../../actionTypes';
import moment from 'moment';

export function setNotification(type, title, msg, id=null) {
  if (arguments.length === 1) {
    id = type;
  }
  return {
    type: SET_NOTIFICATION,
    payload: {
      type, title, msg,
      isAdd: !id,
      id: id || `${moment().unix()}-${Math.floor((1 + Math.random()) * 10000)}`
    }
  };
}
