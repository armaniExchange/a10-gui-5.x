import asyncComponent from 'helpers/asyncComponent';

const ApiTesterRouter = asyncComponent(() =>
  System.import('./index').then(module => module.default)
);

export default {
  path: 'api',
  pages: {
    apitester: {
      component: ApiTesterRouter,
      menuPath: [ 'Dev Tools', 'AXAPI Debugger' ]
    }
  }
};
