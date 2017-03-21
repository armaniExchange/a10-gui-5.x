import asyncComponent from 'helpers/asyncComponent';

import configApp from 'configs/app';
const OEM = configApp.OEM;
const LoginPageLayout = require('oem/' + OEM + '/LoginLayout').default;

const Login = asyncComponent(() =>
  System.import('./login').then(module => module.default),
  LoginPageLayout
);

const Logout = asyncComponent(() =>
  System.import('./logout').then(module => module.default),
  false
);

export default {
  path: 'auth',
  pages: {
    login: {
      component: Login
    },
    logout: {
      component: Logout
    }
  }
};
