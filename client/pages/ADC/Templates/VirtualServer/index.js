import asyncComponent from 'helpers/asyncComponent';

const TemplatesVirtualServerPage = asyncComponent(() =>
  System.import('./Edit').then(module => module.default)
);

export default {
  path: 'virtual-server',
  pages: {
    edit: {
      component: TemplatesVirtualServerPage,
      menuPath: [ 'ADC', 'Templates', 'Virtual Server', 'Edit' ]
    }
  }
};
