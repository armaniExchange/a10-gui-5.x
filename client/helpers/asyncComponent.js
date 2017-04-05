import React from 'react';
import { connect } from 'react-redux';

// import CoreManager from 'helpers/CoreManager';
import configApp from 'configs/app';
// import controlWidget from './WidgetController';
import { mapStateToProps, mapDispatchToProps } from '../redux/container_utils';

const OEM = configApp.OEM;
// const AppLayout = require('../oem/' + OEM + '/AppLayout').default;
const EmptyLayout = require('../oem/' + OEM + '/EmptyLayout').default;

export default function asyncComponent(getComponent, Layout=null) {

  class AsyncComponent extends React.Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentWillMount() {
      if (!this.state.Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component;
          this.setState({ Component });
        });
      }
      // console.log(this.props, ' show props at async component');
    }

    render() {
      const { Component } = this.state;
      if (Component) {
        if (!Layout) {
          Layout = EmptyLayout;
        }

        const Container = connect(mapStateToProps, mapDispatchToProps)(Component);
        return (
          <Layout>
            <Container />
          </Layout>
        );
        // return controlWidget(configApp.WIDGET_MIDDLEWARE)(Layout, Component);

        // const LayoutWrapper = CoreManager({
        //   page: this.props.location.pathname,
        //   pageId: 'default'
        // })(Layout, Component, this.props);
        // return <LayoutWrapper />;
      }
      return null;
    }
  }

  return AsyncComponent;
}
