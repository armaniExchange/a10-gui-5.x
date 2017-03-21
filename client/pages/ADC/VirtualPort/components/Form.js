import React, { PropTypes } from 'react';
import { Col, Row, Panel, FormControl, Checkbox } from 'react-bootstrap';

import { A10Form, A10Field, A10SubmitButtons, A10FormControl, A10Radio, A10Checkbox } from 'a10-widget';

class VirtualPort extends React.Component {

  static displayName = 'VirtualPort';

  static url = '/axapi/v3/slb/virtual-server/{name}/port/';
  // {port-number}+{protocol}

  static propTypes = {
    name: PropTypes.string,
    onSubmit: PropTypes.func,
    onSuccess: PropTypes.func
  };

  render() {
    const { handleSubmit,  name, onSubmit, onSuccess, ...rest } = this.props; // eslint-disable-line

    let formProps;
    if (onSubmit) {
      formProps = { onSubmit };
    } else {
      formProps = {
        onSuccess: onSuccess,
        action: VirtualPort.url,
        method: 'post',
        params: { name }
      };
    }

    return (
      <A10Form {...formProps} horizontal>
        <div>
          <Row>
            <Col xs={12}>
              <Panel header={<h4>Basic Field</h4>}>
                <A10Field inline name="port.name" label="Name">
                  <A10FormControl />
                </A10Field>
                <A10Field inline required name="port.port-number" label="Port">
                  <A10FormControl />
                </A10Field>
                <A10Field inline required name="port.protocol" label="Port Protocol" value="udp">
                  <A10FormControl componentClass="select">
                    <option value="tcp">tcp</option>
                    <option value="udp">udp</option>
                  </A10FormControl>
                </A10Field>
                <A10Field inline name="port.alternate-port" label="Alternate Port"
                  value={1}
                  conditional={{ 'port.protocol': 'tcp' }}>
                  <A10Checkbox value={1} />
                </A10Field>
                <A10Field inline name="port.range" label="Range">
                  <A10FormControl type="number" />
                </A10Field>
                <A10Field inline name="port.conn-limit" label="Connection Limit">
                  <A10FormControl />
                </A10Field>
                <A10Field inline name="port.reset" label="Reset" >
                  <A10Checkbox value={1} />
                </A10Field>
                <A10Field inline name="port.no-logging" label="No Logging" >
                  <A10Checkbox value={1} />
                </A10Field>
                <A10Field inline name="port.action" label="Action">
                  <A10FormControl />
                </A10Field>
                <A10Field inline name="port.service-group" label="Service Group">
                  <A10FormControl />
                </A10Field>
              </Panel>
            </Col>
          </Row>
        </div>
        <div>
          <A10SubmitButtons {...rest}/>
        </div>
      </A10Form>
    );
  }
}

export default VirtualPort;
