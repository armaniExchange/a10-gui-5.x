import { auth } from '../middlewares/routes';

var OEM = 'thunder';
// var LAYOUT = OEM;
// var THEME = OEM;
// var COMPONENT_PAGE_SIZE = 25;
var APP_CONFIGS =  {
  OEM: OEM,
  LAYOUT: OEM,
  THEME: 'default',
  MODULE_NAME: '930',
  COMPONENT_PAGE_SIZE: 15,
  ROUTE_MIDDLEWARES: [
    auth
  ]
};

module.exports = APP_CONFIGS;
