import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// import { Nav, Breadcrumb } from 'react-bootstrap';
// import Loading from 'react-loading';

// import './scss/AppLayout.scss';
import './sass/bootstrap.scss';
import './sass/app.scss';

//issue:LOAD font awesome: https://github.com/gowravshekar/font-awesome-webpack/issues/20
import 'style-loader!css-loader!less-loader!font-awesome-webpack/font-awesome-styles.loader!font-awesome-webpack/font-awesome.config.js';

import { mapStateToProps, mapDispatchToProps } from '../../redux/container_utils';
import LoginForm from 'pages/Common/Auth/components/Form';
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

  static displayName = 'AppLayout';

  static propTypes = {
    children: PropTypes.node,
    app: PropTypes.instanceOf(Map)
  };

  static contextTypes = {
    // props: PropTypes.object.isRequired
    // wm: PropTypes.object.isRequired,
    // appConfig: PropTypes.shape({
    //   OEM: PropTypes.string.isRequired,
    //   MODULE_NAME: PropTypes.string.isRequired
    // })
  };

  constructor(props, context) {
    super(props, context);

    this.currentNotification = [];
    this.state = {
      showLogin: !~sessionStorage.token,
      showError: false
    };
    // this.context.wm.ballKicker.accept([], HIDE_COMPONENT_MODAL, (from, to, params) => { //eslint-disable-line
    //   this.setState({ showLogin: false });
    // }, [ 'app', 'default', 'modal', 'instance' ]);
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
  }

  componentDidUpdate() {
    const {
      app,
      actions: {
        app: { setNotification }
      }
    } = this.props;
    const notification = app.get('notification');
    notification.forEach(notifi => {
      if (this.currentNotification.indexOf(notifi.id) === -1) {
        this.currentNotification.push(notifi.id);
        this._notificationSystem.addNotification({
          level: notifi.type || 'info',
          title: notifi.title,
          message: notifi.msg,
          onRemove: () => {
            setNotification(notifi.id);
            this.currentNotification = this.currentNotification.filter(id => {
              return id != notifi.id;
            });
          }
        });
      }
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   // const { statusCode, errMsg, error, notifiable } = nextProps;

  //   // if (notifiable) {
  //   //   let bsClass = 'success', info = 'Success';
  //   //   let _notify = {
  //   //     title: 'Hi, Something Wrong!!',
  //   //     message: '',
  //   //     autoDismiss: 10,
  //   //     level: bsClass,
  //   //     position: 'tr',
  //   //     dismissible: true,
  //   //     uid: nextProps.axapiUid
  //   //   };

  //   //   if (statusCode >= 400) {
  //   //     info = error || errMsg;
  //   //     bsClass = 'error';
  //   //     _notify.level = bsClass;
  //   //     _notify.message = info;
  //   //   } else if (statusCode >= 200 && statusCode < 300) {
  //   //     bsClass = 'success';
  //   //     info = 'Operation Success!';
  //   //     _notify.level = bsClass;
  //   //     _notify.message = info;
  //   //   }
  //   //   this._notificationSystem.addNotification(_notify);
  //   // }

  //   // this.setState({
  //   //   showLogin: statusCode === 401 || statusCode === 403,
  //   //   showError: statusCode >= 400
  //   // });


  // }

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

    const { children } = this.props;

    if (children.length < 2) {
      throw new Error('AppLayout need at least 2 children');
    }

    return (
      <div>
        <NotificationSystem ref="notificationSystem" />

        <div className="wrapper">
          <Header />

          {children[0]}

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
          <section>{children[1]}</section>
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
export default connect(mapStateToProps, mapDispatchToProps)(AppLayout);
