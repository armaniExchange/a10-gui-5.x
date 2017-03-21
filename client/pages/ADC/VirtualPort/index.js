import asyncComponent from 'helpers/asyncComponent';

const VirtualPortEditPage = asyncComponent(() =>
  System.import('./Edit').then(module => module.default)
);

export default {
  path: 'virtual-port',
  pages: {
    edit: {
      component: VirtualPortEditPage,
      menuPath: [ 'ADC', 'SLB', 'Virtual Port', 'Edit' ]
    }
    // list: VirtualServerListPage
  }
};
