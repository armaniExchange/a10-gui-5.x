import React, { Component, PropTypes } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { A10App } from 'a10-widget';
import { setNotification, setGlobalVar } from './redux/modules/app/actions/index';
import reducer from './redux/modules/reducer';
import Config from './configs/app';
import { PageNotFound } from './pages/StatusPage';
import A10Modules from './pages';

const OEM = Config.OEM;
const AppLayout = require('./oem/' + OEM + '/AppLayout').default;
const EmptyLayout = require('./oem/' + OEM + '/EmptyLayout').default;
const MenuLayout = require('./oem/' + OEM + '/MenuLayout').default;

class Root extends Component {

  static displayName = 'Root';

  static childContextTypes = {
    appConfig: PropTypes.object.isRequired,
    appRouteRule: PropTypes.object.isRequired,
    routeMiddlewares: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.appRouteRule = {};
    this.menus = [];
    Object.keys(A10Modules).map(moduleGroupKey => {
      A10Modules[moduleGroupKey].map(module => {
        const moduleInfo = this.getModulePathAndMenu(module);
        this.menus = this.menus.concat(moduleInfo.menus);
        for (const key in moduleInfo.routes) {
          const pathSegs = moduleInfo.routes[key].split('/');
          const routeName = pathSegs.reduce((prev, seg) => {
            if (seg.length === 0) return prev;
            for (let dashPos = seg.indexOf('-'); dashPos != -1;  dashPos = seg.indexOf('-')) {
              seg = seg.slice(0, dashPos) + seg.slice(dashPos+1, dashPos+2).toUpperCase() + seg.slice(dashPos+2)
            }
            return prev + seg.charAt(0).toUpperCase() + seg.slice(1);
          }, '');
          this.appRouteRule[routeName] = moduleInfo.routes[key];
        }
      });
    });

    this.store = createStore(reducer);
    this.state = { menus: this.menus };
  }

  getChildContext() {
    return {
      appConfig: Config,
      appRouteRule: this.appRouteRule,
      routeMiddlewares: Config.ROUTE_MIDDLEWARES
    };
  }

  getModulePathAndMenu(modules, routes={}, menus=[], pathPrefix=[]) {
    const { name, path, pages, license } = modules;
    const keys = Object.keys(pages);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const { component: Component, menuPath } = pages[key];
      const newPath = [ ...pathPrefix, path ];
      if (Component) {
        newPath.push(key);
        const finalPath = `/${newPath.join('/')}`;
        routes[key] = finalPath;
        if (menuPath) menus.push({ menuPath, path: finalPath });
      } else {
        this.getModulePathAndMenu(pages[key], routes, menus, newPath);
      }
    }
    return { routes, menus };
  }

  renderModuleGroupRoutes(groupKey) {
    let routes = [];
    let indexRoute;
    const moduleRoutes = A10Modules[groupKey].map(module => this.getRoutes(module));
    for (let i = 0; i < moduleRoutes.length; i++) {
      routes = routes.concat(moduleRoutes[i].routes);
      if (moduleRoutes[i].indexRoute) {
        indexRoute = moduleRoutes[i].indexRoute;
      }
    }
    return { routes, indexRoute };
  }

  getRoutes(modules, pathPrefix=[]) {
    let routes = [];
    let indexRoute;
    const { name, path, pages, license } = modules;
    const keys = Object.keys(pages);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const { component: Component, menuPath, index } = pages[key];
      const newPath = [ ...pathPrefix, path ];
      if (Component) {
        newPath.push(key);
        const finalPath = `/${newPath.join('/')}`;
        routes.push(<Route exact key={finalPath} path={finalPath} component={Component} />);
        if (index) {
          indexRoute = <Redirect key={`${finalPath}index`} to={finalPath} />;
        }
      } else {
        const result = this.getRoutes(pages[key], newPath);
        routes = routes.concat(result.routes);
        indexRoute = result.indexRoute;
      }
    }
    return { routes, indexRoute };
  }

  runRouteMiddleware = () => {
    const { ROUTE_MIDDLEWARES: middlewares } = Config;
    const { history } = this.refs.router;
    for (let i = 0; i < middlewares.length; i++) {
      const method = middlewares[i];
      if (!method(this.store.getState(), history, this.appRouteRule)) return;
    }
  }

  componentDidMount() {
    const { history } = this.refs.router;
    history.listen(location => this.runRouteMiddleware());
    this.runRouteMiddleware();
  }

  getAuthToken = () => {
    const { authToken } = this.store.getState().get('globalVar');
    return authToken;
  }

  authFailHandle = (key, name) => {
    this.refs.router.history.push(this.appRouteRule.login);
    this.store.dispatch(setGlobalVar('authToken', null));
  }

  apiErrorHandle = (title, msg) => {
    this.store.dispatch(setNotification('error', title, msg));
  }

  render() {
    const commonRoutes = this.renderModuleGroupRoutes('common');
    const appRoutes = this.renderModuleGroupRoutes('app');
    return (
      <Provider store={this.store} key="provider">
        <BrowserRouter ref="router">
          <A10App authFailHandle={this.authFailHandle} apiErrorHandle={this.apiErrorHandle}
            getAuthToken={this.getAuthToken}>
            <Switch>
              {commonRoutes.routes}
              <Route path="/" render={({ location }) => {
                return (
                  <AppLayout>
                    <MenuLayout menus={this.state.menus} />
                    <Switch>
                      {appRoutes.routes}
                      {appRoutes.indexRoute || <Route component={PageNotFound} />}
                    </Switch>
                  </AppLayout>
                );
              }} />
              {commonRoutes.indexRoute || <Route component={PageNotFound} />}
            </Switch>
          </A10App>
        </BrowserRouter>
      </Provider>
    );
  }

}

export default Root;
