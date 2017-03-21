import asyncComponent from 'helpers/asyncComponent';

const WelcomePage = asyncComponent(() =>
  System.import('./Welcome').then(module => module.default),
  null
);

export default {
  path: 'welcome',
  pages: {
    index: {
      component: WelcomePage
    }
  }
};
