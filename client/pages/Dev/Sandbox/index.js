import React from 'react';
import { Col, Row } from 'react-bootstrap';

// import ApiTesterForm from './components/Form';
import PageBase from 'helpers/PageBase';
import configApp from 'configs/app';
const OEM = configApp.OEM;
const StandardPageLayout = require('oem/' + OEM + '/PageLayout').default;

// test components loading
import ContainerWidget from './components/ContainerWidget';
import NotEditableCom from './components/NotEditableCom';
import EditableCom from './components/EditableCom';
import slbVirtualServerSchema from 'schemas/slb-virtual-server.json';

export default class Sandbox extends PageBase {
  render() {
    // const { handleSubmit,  ...rest } = this.props; // eslint-disable-line
    const metaWithEndpoint = {
      endpoint: '/axapi/v3/slb/virtual-server/vs2', // pre
      name: 'slb.virtual-server.name'
    };

    // const myRequire = (schema) => {
    //   return require('schemas/' + schema + '.json');
    // };
    const urlParams = {
      'name': 'vs2',
      'port-number': 80,
      'protocol': 'http'
    };

    const metaWithSchema = {
      schema: 'slb-virtual-server.port-list',
      name: 'port.port-number',
      initial: '80',
      // loadInitial: true,
      urlParams
    };

    const containerSchema = {
      schema: 'slb-virtual-server.port-list',
      name: 'port.name',
      initial: 'test',
      // loadInitial: true,
      urlParams
    };

    const objectSchema = {
      schema: slbVirtualServerSchema,
      name: 'virtual-server.netmask',
      // initial: '/24',
      loadInitial: true,
      urlParams
    };

    const noSchemaData = {
      name: 'slb-virtual-server.virtual-server.ip-address',
      initial: '192.168.4.4',
      loadInitial: true
    };

    // console.log(metaWithSchema, containerSchema);

    return (
      <Row>
        <Col xs={12}>
          <StandardPageLayout title="Sandbox" description="Sandbox Page">
            <ContainerWidget meta={containerSchema}>
              <h3> not editable component </h3>
              <NotEditableCom meta={metaWithEndpoint}/>
              <h3> Editable component </h3>
              <EditableCom meta={metaWithSchema} urlParams={urlParams}/>
              <EditableCom meta={noSchemaData} urlParams={urlParams}/>
              <EditableCom meta={objectSchema} />
            </ContainerWidget>
          </StandardPageLayout>
        </Col>
      </Row>
    );
  }
}
