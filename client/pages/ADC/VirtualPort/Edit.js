import React, { Component, PropTypes } from 'react';

import configApp from 'configs/app';
const OEM = configApp.OEM;
const StandardPageLayout = require('oem/' + OEM + '/PageLayout').default;

import VirtualPortForm from './components/Form';
// import PageBase from 'helpers/PageBase';
// import pageWrapper from 'helpers/pageWrapper';
// import { widgetWrapper } from '@a10/a10-widget';

class VirtualPortEdit extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired
  };

  onSuccess = () => {
    const {
      app: { setNotification }
    } = this.props.actions;
    setNotification('success', 'Success', 'Edit successful');
  };

  render() {
    return (
      <StandardPageLayout title="Virtual Port Edit" description="Virtual Port Is A Port Of Virtual Server">
        <VirtualPortForm onSuccess={this.onSuccess} />
      </StandardPageLayout>
    );
  }
}

export default VirtualPortEdit;
