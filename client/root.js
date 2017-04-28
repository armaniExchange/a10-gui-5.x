import React, { Component, PropTypes } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Map } from 'immutable';

import { A10App } from '@a10/a10-widget';
import { setNotification, setGlobalVar } from './redux/modules/app/actions/index';
import reducer from './redux/modules/reducer';
import Config from './configs/app';
import { PageNotFound } from './pages/StatusPage';
import A10Modules from './pages';
import '@a10/a10-widget/dist/style.css';

const OEM = Config.OEM;
const AppLayout = require('./oem/' + OEM + '/AppLayout').default;
const MenuLayout = require('./oem/' + OEM + '/MenuLayout').default;

class Root extends Component {

  static displayName = 'Root';

  static childContextTypes = {
    appConfig: PropTypes.object.isRequired,
    routeAlias: PropTypes.object.isRequired,
    routeMiddleware: PropTypes.array.isRequired,
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.store = createStore(reducer);
    this.routeAlias = {};
    this.state = {
      menus: {},
      licenses: null,
      appRoutes: [],
      appIndexRoute: null,
      commonRoutes: []
    };
  }

  getChildContext() {
    return {
      appConfig: Config,
      routeAlias: this.routeAlias,
      routeMiddleware: Config.ROUTE_MIDDLEWARE,
      store: this.store
    };
  }

  runRouteMiddleware = () => {
    const { ROUTE_MIDDLEWARE: middleware } = Config;
    const { history } = this.refs.router;
    for (let i = 0; i < middleware.length; i++) {
      const method = middleware[i];
      if (!method(this.store.getState(), history, this.routeAlias)) return;
    }
  };

  getAuthToken = () => {
    const { authToken } = this.store.getState().get('globalVar');
    return authToken;
  };

  authFailHandle = () => {
    this.refs.router.history.push(this.routeAlias.CommonAuthLogin);
    this.store.dispatch(setGlobalVar('authToken', null));
  };

  apiErrorHandle = (title, msg) => {
    this.store.dispatch(setNotification('error', title, msg));
  };

  convertModuleData(module, prefix='') {
    const { path, pages } = module;
    const keys = Object.keys(pages);
    let result = { app: [], common: [] };
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const { component, menuPath, index } = pages[key];
      const newPrefix = `${prefix}/${path}`;
      if (component) {
        const pagePath = `${newPrefix}/${key}`;
        const currentResult = result[menuPath ? 'app' : 'common'];
        currentResult.push({
          menuPath,
          path: pagePath,
          component: component,
          index
        });
      } else {
        const prevResult = this.convertModuleData(pages[key], newPrefix);
        result = {
          app: [ ...prevResult.app, ...result.app ],
          common: [ ...prevResult.common, ...result.common ]
        };
      }
    }
    return result;
  }

  getAliasName(path) {
    const pathSegs = path.split('/');
    return pathSegs.reduce((prev, seg) => {
      if (seg.length === 0) return prev;
      for (let dashPos = seg.indexOf('-'); dashPos != -1;  dashPos = seg.indexOf('-')) {
        seg = seg.slice(0, dashPos) + seg.slice(dashPos+1, dashPos+2).toUpperCase() + seg.slice(dashPos+2);
      }
      return prev + seg.charAt(0).toUpperCase() + seg.slice(1);
    }, '');
  }

  updateRoutes() {
    const { MODULE_MIDDLEWARE, PAGE_MIDDLEWARE } = Config;
    const currentState = this.store.getState();
    const globalVar = currentState.get('globalVar');
    const { licenses } = globalVar;

    let menus = Map();
    let appIndexRoute;
    const routeAlias = {};
    const appRoutes = [];
    const commonRoutes = [];

    Object.keys(A10Modules).forEach(moduleGroupKey => {
      A10Modules[moduleGroupKey].forEach(module => {
        if (licenses) {
          for (let i = 0; i < MODULE_MIDDLEWARE.length; i++) {
            if (!MODULE_MIDDLEWARE[i](module, licenses, currentState)) return false;
          }
        }

        const { app, common } = this.convertModuleData(module);
        app.forEach(pageInfo => {
          for (let i = 0; i < PAGE_MIDDLEWARE.length; i++) {
            if (!PAGE_MIDDLEWARE[i](module, pageInfo, globalVar)) return false;
          }
          const { path, component, index, menuPath } = pageInfo;
          routeAlias[this.getAliasName(path)] = path;
          appRoutes.push(<Route exact key={path} path={path} component={component} />);
          if (index) appIndexRoute = <Redirect key={`${path}index`} to={path} />;
          if (menuPath) menus = menus.setIn(menuPath, path);
        });
        common.forEach(pageInfo => {
          const { path, component } = pageInfo;
          routeAlias[this.getAliasName(path)] = path;
          commonRoutes.push(<Route exact key={path} path={path} component={component} />);
        });
      });
    });

    this.setState({
      menus: menus.toJS(),
      appRoutes, appIndexRoute, commonRoutes
    });
    this.routeAlias = routeAlias;
  }

  componentWillMount() {
    this.updateRoutes();
  }

  componentDidMount() {
    const { history } = this.refs.router;
    history.listen(() => this.runRouteMiddleware());
    this.runRouteMiddleware();
  }

  render() {
    const { menus, appRoutes, appIndexRoute, commonRoutes } = this.state;
    return (
      <Provider store={this.store} key="provider">
        <BrowserRouter ref="router">
          <A10App authFailHandle={this.authFailHandle} apiErrorHandle={this.apiErrorHandle}
            getAuthToken={this.getAuthToken}>
            <Switch>
              {commonRoutes}
              <Route path="/" render={() => {
                return (
                  <AppLayout>
                    <MenuLayout menus={menus} />
                    <Switch>
                      {appRoutes}
                      {appIndexRoute || <Route component={PageNotFound} />}
                    </Switch>
                  </AppLayout>
                );
              }} />
            </Switch>
          </A10App>
        </BrowserRouter>
      </Provider>
    );
  }

}

export default Root;
