import { auth } from '../middlewares/routes';
// import { VCS } from '../middlewares/widgets';
// import { moduletest } from '../middlewares/modules';
// import { partitionCheck } from '../middlewares/pages';

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
  MODULE_MIDDLEWARE: [
    // moduletest
  ],
  PAGE_MIDDLEWARE: [
    // partitionCheck
  ],
  WIDGET_MIDDLEWARE: [
    // VCS
  ],
  ROUTE_MIDDLEWARE: [
    auth
  ]
};

module.exports = APP_CONFIGS;
