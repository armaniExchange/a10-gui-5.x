import { REGISTER_THEME_LAYOUT, REGISTER_THEME_STYLE } from '../actionTypes';

export const setLayout = (page, layout) => {
  return { type: REGISTER_THEME_LAYOUT, page, layout };
};

export const setStyle = (page, style) => {
  return { type: REGISTER_THEME_STYLE, page, style };
};
