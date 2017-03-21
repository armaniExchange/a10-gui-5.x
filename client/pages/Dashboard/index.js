import asyncComponent from 'helpers/asyncComponent';

const SLBDashboard = asyncComponent(() =>
  System.import('./components/SLB').then(module => module.default)
);

export default {
  path: 'dashboard',
  pages: {
    slb: {
      component: SLBDashboard,
      menuPath: [ 'Dashboard', 'SLB' ],
      index: true
    }
  },
  license: {
    'source2-module':'WEBROOT',
    'source2-expiry':'N/A',
    'source2-notes':'Requires an additional Webroot license.'
  }
};
