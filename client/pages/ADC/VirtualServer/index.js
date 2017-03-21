import asyncComponent from 'helpers/asyncComponent';

const VirtualServerEditPage = asyncComponent(() =>
  System.import('./Edit').then(module => module.default)
);

const VirtualServerListPage = asyncComponent(() =>
  System.import('./List').then(module => module.default)
);

export default {
  path: 'virtual-server',
  pages: {
    edit: {
      component: VirtualServerEditPage,
      menuPath: [ 'ADC', 'SLB', 'Virtual Server', 'Edit' ]
    },
    list: {
      component: VirtualServerListPage,
      menuPath: [ 'ADC', 'SLB', 'Virtual Server', 'List' ]
    }
  }
};
