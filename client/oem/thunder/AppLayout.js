import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// import { Nav, Breadcrumb } from 'react-bootstrap';
// import Loading from 'react-loading';

import Menu from 'components/Menu';
// import './scss/AppLayout.scss';
import './sass/bootstrap.scss';
import './sass/app.scss';

//issue:LOAD font awesome: https://github.com/gowravshekar/font-awesome-webpack/issues/20
import 'style-loader!css-loader!less-loader!font-awesome-webpack/font-awesome-styles.loader!font-awesome-webpack/font-awesome.config.js';

import LoginForm from 'pages/Auth/components/Form';
import { LAST_PAGE_KEY } from 'configs/appKeys';
import NotificationSystem from 'react-notification-system';
import { HIDE_COMPONENT_MODAL } from 'configs/messages';
import configApp from 'configs/app';

const OEM = configApp.OEM;
const ModalLayout = require('oem/' + OEM + '/ModalLayout').default;


import Header from './Libs/App/Header';
// import Sidebar from './Libs/App/Sidebar';
import Offsidebar from './Libs/App/Offsidebar';
import Footer from './Libs/App/Footer';

class AppLayout extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  static contextTypes = {
    props: PropTypes.object.isRequired,
    wm: PropTypes.object.isRequired,
    appConfig: PropTypes.shape({
      OEM: PropTypes.string.isRequired,
      MODULE_NAME: PropTypes.string.isRequired
    })
  }

  state = {
    showLogin: !~sessionStorage.token,
    showError: false
  };

  constructor(props, context) {
    super(props, context);
    this.context.wm.ballKicker.accept([], HIDE_COMPONENT_MODAL, (from, to, params) => { //eslint-disable-line
      this.setState({ showLogin: false });
    }, [ 'app', 'default', 'modal', 'instance' ]);
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
  }

  componentWillReceiveProps(nextProps) {
    const { statusCode, errMsg, error, notifiable } = nextProps;

    if (notifiable) {
      let bsClass = 'success', info = 'Success';
      let _notify = {
        title: 'Hi, Something Wrong!!',
        message: '',
        autoDismiss: 10,
        level: bsClass,
        position: 'tr',
        dismissible: true,
        uid: nextProps.axapiUid
      };

      if (statusCode >= 400) {
        info = error || errMsg;
        bsClass = 'error';
        _notify.level = bsClass;
        _notify.message = info;
      } else if (statusCode >= 200 && statusCode < 300) {
        bsClass = 'success';
        info = 'Operation Success!';
        _notify.level = bsClass;
        _notify.message = info;
      }
      this._notificationSystem.addNotification(_notify);
    }

    this.setState({
      showLogin: statusCode === 401 || statusCode === 403,
      showError: statusCode >= 400
    });


  }


  render() {
    // console.log('context on layout', this);

    // Animations supported
    //      'rag-fadeIn'
    //      'rag-fadeInUp'
    //      'rag-fadeInDown'
    //      'rag-fadeInRight'
    //      'rag-fadeInLeft'
    //      'rag-fadeInUpBig'
    //      'rag-fadeInDownBig'
    //      'rag-fadeInRightBig'
    //      'rag-fadeInLeftBig'
    //      'rag-zoomBackDown'

    // const animationName = 'rag-fadeIn';

    return (
      <div>
        <NotificationSystem ref="notificationSystem" />

        <div className="wrapper">
          <Header />

          <Menu />

          <Offsidebar />

          {/* <ReactCSSTransitionGroup
            component="section"
            transitionName={animationName}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          > */}
          {/* {React.cloneElement(this.props.children, {
            key: Math.random()
          })} */}
          <section>
            {this.props.children}
          </section>
          {/* </ReactCSSTransitionGroup> */}

          <Footer />

          <ModalLayout visible={this.state.showLogin}  onHide={this.close} title="Login" >
            <LoginForm modal />
          </ModalLayout>
        </div>
      </div>
    );

  }
}

let InitializeFromStateForm = connect(
  (state) => ({
    isLoading: state.getIn([ 'app', LAST_PAGE_KEY, 'axapi', 'isLoading' ], false),
    axapiUid: state.getIn([ 'app', LAST_PAGE_KEY, 'axapiUid' ]),
    statusCode: state.getIn([ 'app', LAST_PAGE_KEY, 'axapi', 'statusCode' ]),
    errMsg: state.getIn([ 'app', LAST_PAGE_KEY, 'axapi', 'response', 'err', 'msg' ]),
    notifiable: state.getIn([ 'app', LAST_PAGE_KEY, 'axapiNeedNotify' ])
  })
)(AppLayout);

export default InitializeFromStateForm;
