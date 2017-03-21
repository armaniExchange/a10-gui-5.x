import React from 'react';
import VirtualServerTable from './components/Table';

import configApp from 'configs/app';
const OEM = configApp.OEM;
const StandardPageLayout = require('oem/' + OEM + '/PageLayout').default;

export default function VirtualServerList(props) {
  return (
    <StandardPageLayout title="Virtual Servers" description="Virtual Servers List Page">
      <VirtualServerTable {...props} />
    </StandardPageLayout>
  )
}
