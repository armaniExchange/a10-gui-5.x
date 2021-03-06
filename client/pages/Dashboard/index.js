// import React, { Component } from 'react';
import DashboardRouter from './Router';
// import ViewManager from 'helpers/ViewManager';
// import LicenseManager from 'helpers/ViewManagerPlugins/LicenseManager';
import ModuleBase from 'helpers/ModuleBase';


class DashboardModule extends ModuleBase {
  path = 'dashboard'

  license = {
    'source2-module':'WEBROOT',
    'source2-expiry':'N/A',
    'source2-notes':'Requires an additional Webroot license.'
  }  

  routers = [ DashboardRouter ]
}

export default DashboardModule;
