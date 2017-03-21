import React, { Component, PropTypes } from 'react';

import configApp from 'configs/app';
const OEM = configApp.OEM;
const StandardPageLayout = require('oem/' + OEM + '/PageLayout').default;

import TemplateVirtualServerForm from './components/Form';

class TemplateVirtualServerEdit extends Component {

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
      <StandardPageLayout title="Template Virtual Server Edit" description="Template Virtual Server Has Advanced Virtual Server Options">
        <TemplateVirtualServerForm onSuccess={this.onSuccess} />
      </StandardPageLayout>
    );
  }
}

export default TemplateVirtualServerEdit;
