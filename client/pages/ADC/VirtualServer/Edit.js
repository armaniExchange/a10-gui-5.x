import React, { PropTypes } from 'react';

import configApp from 'configs/app';
const OEM = configApp.OEM;
const StandardPageLayout = require('oem/' + OEM + '/PageLayout').default;

import VirtualServerForm from './components/VirtualServerForm';

// import { widgetWrapper } from '@a10/a10-widget';

class VirtualServerEditor extends React.Component {

  static displayName = 'VirtualServerEditor';

  static contextTypes = {
    router: PropTypes.object.isRequired,
    routeAlias: PropTypes.object.isRequired
  };

  static propTypes = {
    actions: PropTypes.object.isRequired
  };

  onSuccess = () => {
    const {
      app: { setNotification }
    } = this.props.actions;
    const { router, routeAlias } = this.context;
    setNotification('success', 'Success', 'Edit successful');
    router.history.push(routeAlias.AdcVirtualServerList);
  };

  render() {
    return (
      <StandardPageLayout title="Virtual Server Edit" description="Virtual Server Is A Main Object For SLB">
        <VirtualServerForm onSuccess={this.onSuccess} />
      </StandardPageLayout>
    );
  }
}

export default VirtualServerEditor;
