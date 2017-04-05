import { SET_GLOBAL_VAR } from '../../actionTypes';

const globalVarReducer = {
  [ SET_GLOBAL_VAR ](state, { payload }) {
    const globalVars = state;
    const { key, value } = payload;

    if (key === 'authToken') {
      if (value) sessionStorage.setItem('token', value);
      else sessionStorage.removeItem('token');
    }

    return {
      ...globalVars,
      [ key ]: value
    };
  }
};
export default globalVarReducer;
