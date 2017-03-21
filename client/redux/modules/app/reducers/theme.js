
import { REGISTER_THEME_LAYOUT, REGISTER_THEME_STYLE } from '../actionTypes';

const themeReducers = {
  [ REGISTER_THEME_LAYOUT ](state, { layout }) {
    return state.setIn([ 'theme', 'layout' ], layout);
  },
  [ REGISTER_THEME_STYLE ](state, { style }) {
    return state.setIn([ 'theme', 'style' ], style);
  }
};

export default themeReducers;
