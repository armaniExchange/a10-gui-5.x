import {
    REGISTER_PAGE_VAR, REGISTER_PAGE_TITLE , REGISTER_PAGE_BREADCRUMB, UPDATE_CURRENT_PAGE, REGISTER_PAGE_VISIBLE, // eslint-disable-line
    REGISTER_CURRENT_PAGE,  DESTROY_PAGE
} from '../actionTypes';

import { APP_CURRENT_PAGE } from 'configs/appKeys';

// ----------------------Action------------------
// export const registerPageVar = (pagePath, node, payload) => {
//   return { type: REGISTER_PAGE_VAR, pagePath, node, payload };
// };

export const registerCurrentPage = (pagePath, env) => {
  return { type: REGISTER_CURRENT_PAGE, pagePath, env };
};
//
// export const updateCurrentPage = (pagePath, env) => {
//   return { type: UPDATE_CURRENT_PAGE, pagePath, env };
// };
//
// export const setPageTitle = (pagePath, title) => {
//   return { type: REGISTER_PAGE_TITLE, pagePath, title };
// };
//
// export const setPageBreadcrumb = (pagePath, breadcrumb) => {
//   return { type: REGISTER_PAGE_BREADCRUMB, pagePath, breadcrumb };
// };
//
// export const setPageVisible = (pagePath, currentPage, visible, id='default') => {
//   if (!currentPage) {
//     currentPage = pagePath.page;
//   }
//   return { type: REGISTER_PAGE_VISIBLE, pagePath, currentPage, visible, id };
// };
//
// export const setLastPageVisible = (pagePath, visible, id='default') => {
//   return { type: REGISTER_PAGE_VISIBLE, pagePath, visible, id };
// };

export const destroyPage = (pagePath) => {
  return { type: DESTROY_PAGE, pagePath };
};
