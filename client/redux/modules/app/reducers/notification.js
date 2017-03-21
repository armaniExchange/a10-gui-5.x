import { SET_NOTIFICATION } from '../../actionTypes';

const notificationReducer = {
  [ SET_NOTIFICATION ](state, { payload }) {
    const { isAdd, id } = payload;
    const notifiMsg = state;
    if (isAdd) {
      state = [
        ...notifiMsg,
        payload
      ];
    } else {
      state = notifiMsg.filter(data => {
        if (data.id === id) return false;
        return true;
      });
    }
    return state;
  }
}
export default notificationReducer;
