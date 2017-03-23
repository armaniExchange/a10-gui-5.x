import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import ChooseBoard from '../../../components/Solutions/ChooseBoard';
import LangDropdown from '../../../components/Dropdown/lang';
import './assets/sass/index.scss';
import configApp from 'configs/app';

const OEM = configApp.OEM;
// const logo = require('oem/' + OEM + '/img/logo.png');
const logoLarger = require('oem/' + OEM + '/img/logo-larger.png');

class Welcome extends Component {

  static displayName = 'Welcome';

  static contextTypes = {
    router: PropTypes.object.isRequired,
    appRouteRule: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  get isFirstLogin() {
    let cookies = document.cookie;
    return cookies.indexOf('isFirstLogin=false') === -1;
  }

  componentDidMount() {
    document.cookie = 'isFirstLogin=false';
  }

  render() {
    const { appRouteRule } = this.context;

    if (!this.isFirstLogin) {
      return <Redirect to={appRouteRule.DashboardSlb} />;
    }

    return (
      <div id="welcome-container">
        <header className="topnavbar-wrapper">
          <nav role="navigation" className="navbar topnavbar" style={{ padding:0 }}>
            <div className="navbar-header">
              <a href="#/" className="navbar-brand">
                <div className="brand-logo">
                  <img src={logoLarger} alt="A10networks Inc." className="img-responsive" style={{ width: '80px' }} />
                </div>
                <div className="brand-logo-collapsed">
                  <img src={logoLarger} alt="A10networks Inc." className="img-responsive" style={{ width: '80px' }} />
                </div>
              </a>
            </div>
            <div className="nav-wrapper">
              <ul className="nav navbar-nav navbar-right">
                <li><LangDropdown /></li>
              </ul>
            </div>
          </nav>
        </header>

        <main>
          <h2>Welcome to choose Thunder 930 Series</h2>
          <p>
            We have pioneered a new generation of application networking technologies. Our solutions enable enterprises, service providers, Web giants and government organizations to accelerate, secure and optimize the performance of their data center applications and networks. Our Advanced Core Operating System (ACOS®) platform is designed to deliver substantially greater performance and security relative to prior generation application networking products. Our software-based ACOS architecture provides the flexibility that enables us to expand our business with additional products to solve a growing array of networking and security challenges across cloud computing and mobility. A10 Networks has a portfolio of application-layer networking products that assure user-to-application connectivity is available, accelerated and secure.
          </p>
          <ChooseBoard />
        </main>

        <div className="toolbar">
          <Button href={appRouteRule.DashboardSlb}>Skip</Button>
        </div>
      </div>
    );
  }

}

export default Welcome;
