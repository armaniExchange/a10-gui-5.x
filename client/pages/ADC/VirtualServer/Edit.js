import React, { PropTypes } from 'react';

import configApp from 'configs/app';
const OEM = configApp.OEM;
const StandardPageLayout = require('oem/' + OEM + '/PageLayout').default;

import VirtualServerForm from './components/VirtualServerForm';

import { widgetWrapper } from 'a10-widget';

class VirtualServerEditor extends React.Component {

  static displayName = 'VirtualServerEditor';

  static contextTypes = {
    router: PropTypes.object.isRequired,
    appRouteRule: PropTypes.object.isRequired
  };

  static propTypes = {
    actions: PropTypes.object.isRequired
  };

  onSuccess = () => {
    const {
      app: { setNotification }
    } = this.props.actions;
    setNotification('success', 'Success', 'Edit successful');
    // this.context.router.history.push();
  };

  render() {
    console.log(this.context);
    return (
      <StandardPageLayout title="Virtual Server Edit" description="Virtual Server Is A Main Object For SLB">
        <VirtualServerForm onSuccess={this.onSuccess} />
      </StandardPageLayout>
    );
  }
}

export default widgetWrapper()(VirtualServerEditor);
