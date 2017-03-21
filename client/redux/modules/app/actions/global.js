import { SET_GLOBAL_VAR } from '../../actionTypes';

export function setGlobalVar(key, value) {
  return {
    type: SET_GLOBAL_VAR,
    payload: { key, value }
  };
}
