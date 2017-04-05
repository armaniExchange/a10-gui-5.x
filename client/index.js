import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import installDevTools from 'immutable-devtools';
// import { AppContainer } from 'react-hot-loader';
import Perf from 'react-addons-perf';

import Root from './root';
import { createDomElement } from 'helpers/dom';
import './index.ejs';

let render = createDomElement;
if (__DEV__) { // eslint-disable-line
  installDevTools(Immutable);

  window.Perf = Perf;

  render = (Component, id) => {
    setTimeout(() => {
      ReactDOM.render(
        Component,
        document.getElementById(id)
      );
    });
  };

  if (module.hot) {
    module.hot.accept('./root', () => {
      const Root = require('./root').default;
      render(
        <Root />,
        'root'
      );
    });
  }
}

render(
  <Root />,
  'root'
);
