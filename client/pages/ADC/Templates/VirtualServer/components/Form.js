import React, { Component, PropTypes } from 'react';
import { Checkbox, Radio, Col, Row, Panel } from 'react-bootstrap';

import { A10Field, A10Form, A10FormControl, A10Checkbox, A10SubmitButtons, A10Radio } from 'a10-widget';

class TemplateVirtualServerForm extends Component {

  static url = '/axapi/v3/slb/template/virtual-server/';

  static displayName = 'TemplateVirtualServerForm';

  static propTypes = {
    onSuccess: PropTypes.func
  };

  render() {
    const { handleSubmit,  onSuccess, onClose, ...rest } = this.props; // eslint-disable-line
    return (
      <A10Form action={TemplateVirtualServerForm.url} method="post" horizontal onSuccess={onSuccess}>
        <div>
          <Row>
            <Col xs={12}>
              <Panel header={<h4>Basic Field</h4>}>
                <A10Field inline required
                  name="virtual-server.name"
                  label="Name">
                  <A10FormControl min={1} max={127} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.conn-limit"
                  label="Connection Limit"
                  value={8000000}>
                  <A10FormControl type="number" min={1} max={8000000} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.conn-limit-reset"
                  label="Connection Limit Reset">
                  <A10Checkbox value={1} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.conn-limit-no-logging"
                  label="Connection Limit No Logging">
                  <A10Checkbox value={1} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.conn-rate-limit"
                  label="Connection Rate Limit">
                  <A10FormControl type="number" min={1} max={1048575} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.rate-interval"
                  label="Per"
                  value="second"
                  conditional={{ 'virtual-server.conn-rate-limit': true }}>
                  <A10Radio value="100ms" inline> 100ms </A10Radio>
                  <A10Radio value="second" inline> 1 second </A10Radio>
                </A10Field>
                <A10Field inline
                  name="virtual-server.conn-rate-limit-reset"
                  label="Connection Rate Limit Reset"
                  value={0}>
                  <A10Checkbox value={1} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.conn-rate-limit-no-logging"
                  label="Connection Rate Limit No Logging"
                  value={0}>
                  <A10Checkbox value={1} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.icmp-rate-limit"
                  label="ICMP Rate Limit">
                  <A10FormControl type="number" min={1} max={65535} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.icmp-lockup"
                  label="ICMP Lockup">
                  <A10FormControl type="number" min={1} max={65535} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.icmp-lockup-period"
                  label="ICMP Lockup Period (seconds)">
                  <A10FormControl type="number" min={1} max={16383} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.icmpv6-rate-limit"
                  label="ICMPv6 Rate Limit">
                  <A10FormControl type="number" min={1} max={65535} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.icmpv6-lockup"
                  label="ICMPv6 Lockup">
                  <A10FormControl type="number" min={1} max={65535} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.icmpv6-lockup-period"
                  label="ICMPv6 Lockup Period (seconds)">
                  <A10FormControl type="number" min={1} max={16383} />
                </A10Field>
                <A10Field inline
                  name="virtual-server.subnet-gratuitous-arp"
                  label="Subnet Gratuitous ARP"
                  value={0}>
                  <A10Checkbox value={1} />
                </A10Field>
              </Panel>
            </Col>
          </Row>
        </div>
        <div>
          <A10SubmitButtons {...rest} onClose={onClose}/>
        </div>
      </A10Form>
    );
  }
}

export default TemplateVirtualServerForm;
