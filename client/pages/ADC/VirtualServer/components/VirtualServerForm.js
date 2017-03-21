import React, { Component, PropTypes } from 'react';
import { Col, Row, Panel, Radio, Checkbox, FormControl } from 'react-bootstrap';

import { A10Form, A10Field, A10MultiField, A10DynamicSelect,
         A10FormControl, A10Radio, A10Checkbox, A10SubmitButtons } from 'a10-widget';
import { required } from 'a10-widget-lib';
// import { isInt } from 'helpers/validations';

import VirtualPortForm from 'pages/ADC/VirtualPort/components/Form';
import TemplateVirtualServerForm from 'pages/ADC/Templates/VirtualServer/components/Form';

// const makeError = (status=true, errMsg='') => ( status ? '' : errMsg );

// const ipv4 = (value) => {
//   const reg = /^(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/;
//   return makeError(reg.test(value), 'IPv4 Required');
// };

class VirtualServerForm extends Component {

  static displayName = 'VirtualServerForm';

  static url = '/axapi/v3/slb/virtual-server/';

  static propTypes = {
    onSuccess: PropTypes.func,
    onError: PropTypes.func
  };

  render() {
    return (
      <A10Form action={this.url} method="post" horizontal
        onSuccess={this.props.onSuccess}
        onError={this.props.onError}>
        <div>
          <Row>
            <Col xs={12} md={12} lg={6}>
              <Panel header={<h4>Basic Field</h4>} collapsible defaultExpanded>
                <A10Field required inline
                  name="virtual-server.name"
                  label="Name"
                  validation={required}>
                  <A10FormControl />
                </A10Field>
                <A10Field inline
                  name="virtual-server.wildcard"
                  label="Wildcard"
                  componentClass='checkbox'>
                  <A10Checkbox value={1} />
                </A10Field>
                <A10Field required inline
                  name="virtual-server.address-type"
                  label="Address Type"
                  componentClass='radio'
                  value="0"
                  notRegular>
                  <A10Radio value="0" inline> IPv4 </A10Radio>
                  <A10Radio value="1" inline> IPv6 </A10Radio>
                </A10Field>
                <A10Field required inline
                  name="virtual-server.ip-address"
                  label="IPv4 Address"
                  conditional={{
                    'virtual-server.wildcard': 0,
                    'virtual-server.address-type': '0'
                  }}>
                  <A10FormControl />
                </A10Field>
                <A10Field inline
                  name="virtual-server.netmask"
                  label="Netmask"
                  conditional={{
                    'virtual-server.wildcard': 0,
                    'virtual-server.address-type': '0'
                  }}>
                  <A10FormControl />
                </A10Field>
                <A10Field required inline
                  name="virtual-server.ipv6-address"
                  label="IPv6 Address"
                  conditional={{
                    'virtual-server.wildcard': 0,
                    'virtual-server.address-type': '1'
                  }}>
                  <A10FormControl />
                </A10Field>
                <A10Field inline
                  name="virtual-server.acl"
                  label="ACL"
                  conditional={{
                    'virtual-server.wildcard': 1,
                    'virtual-server.address-type': '0'
                  }}>
                  <A10FormControl />
                </A10Field>
                <A10Field inline
                  name="virtual-server.ipv6-acl"
                  label="IPv6 ACL"
                  conditional={{
                    'virtual-server.wildcard': 1,
                    'virtual-server.address-type': '1'
                  }}>
                  <A10FormControl />
                </A10Field>
                <A10Field inline
                  name="virtual-server.enable-disable-action"
                  label="Action"
                  componentClass="select"
                  value="enable">
                  <A10FormControl componentClass="select">
                    <option value="enable">Enable</option>
                    <option value="disable">Disable</option>
                    <option value="disable-when-all-ports-down">When All Port Down</option>
                    <option value="disable-when-any-port-down">When Any Port Down</option>
                  </A10FormControl>
                </A10Field>
              </Panel>

              <Panel header={<h4>Virtual Server Advanced Fields</h4>} collapsible>
                <A10Field inline
                  name="virtual-server.arp-disable"
                  label="Disable ARP"
                  value={0}
                  componentClass="checkbox">
                  <A10Checkbox value={1} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.stats-data-action"
                  label="Stats Data Action"
                  value="stats-data-enable"
                  componentClass="radio">
                  <A10Radio value="stats-data-enable" inline> Enable </A10Radio>
                  <A10Radio value="stats-data-disable" inline> Disable </A10Radio>
                </A10Field>
                <A10Field inline
                  name="virtual-server.extended-stats"
                  label="Extended Stats"
                  value={0}
                  componentClass="checkbox">
                  <A10Checkbox value={1} />
                </A10Field>
                <A10Field inline
                   name="virtual-server.redistribution-flagged"
                   label="Redistribution Flagged"
                   value={0}
                   componentClass="checkbox">
                  <A10Checkbox value={1} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.template-virtual-server"
                  label="Virtual Server Template"
                  conditional={false}>
                  <A10DynamicSelect
                    primaryKey="name"
                    modalOptions={{
                      title: 'Create Virtual Server Template',
                      bsSize:'super',
                      form: TemplateVirtualServerForm
                    }}/>
                </A10Field>
                <A10Field inline name="virtual-server.description" label="Description">
                  <A10FormControl />
                </A10Field>
              </Panel>
            </Col>

            <Col xs={12} md={12} lg={6}>
              <Panel collapsible defaultExpanded header={<h4>Virtual Ports</h4>}>
                {
                  // linkFrom="virtual-server.name"
                  // linkTo="name"
                }
                <A10MultiField name="virtual-server.port-list"
                  modalOptions={{
                    title: 'Create Virtual Port',
                    bsSize: 'super',
                    form: VirtualPortForm,
                    onError: this.onVirtualPortModalError
                  }}>
                  <A10Field name="port-number" title="Port Number" searchable={true} primary={true}>
                    <A10FormControl />
                  </A10Field>
                  <A10Field name="range" title="Port Range">
                    <A10FormControl />
                  </A10Field>
                  <A10Field layout={false} name="protocol" title="Protocol" value="tcp">
                    <A10FormControl componentClass="select" value="tcp">
                      <option value="tcp">tcp</option>
                      <option value="udp">udp</option>
                    </A10FormControl>
                  </A10Field>
                </A10MultiField>
              </Panel>
            </Col>
          </Row>
        </div>
        <div>
          <A10SubmitButtons {...this.props} />
        </div>
      </A10Form>
    );
  }
}
export default VirtualServerForm;
