import React, { PropTypes } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import { TableHeaderColumn } from 'react-bootstrap-table';  // in ECMAScript 6
// import { cloneDeep } from 'lodash';

import VirtualServerForm from 'pages/ADC/VirtualServer/components/VirtualServerForm';
// import slbVirtualServerSchema from 'slb-virtual-server.json';
// import { Schema } from '@a10/a10-widget-lib';

import { A10Table, A10TableColumn } from '@a10/a10-widget';

class VirtualServerTable extends React.Component {

  static url = '/axapi/v3/slb/virtual-server/';

  static displayName = 'VirtualServerTable';

  static contextTypes = {
    apiClient: PropTypes.object.isRequired,
    routeAlias: PropTypes.object.isRequired
  };

  render() {
    const { routeAlias } = this.context;
    const formatStat = (cell) => {
      return cell && cell.toUpperCase();
    };

    // const popupInfo = {
    //   componentClass: VirtualServerForm,
    //   modalProps: {
    //     title: 'Create Virtual Server',
    //     bsSize:'super'
    //     // componentClassName: 'super-large-modal'
    //   },
    //   connectOptions: {
    //     connectToValue: {
    //       'virtual-server': {
    //         'template-virtual-server': 'virtual-server.name'
    //       }
    //     }
    //   }
    // };

    const formatName = (cell) => {
      // let pop = cloneDeep(popupInfo);
      // pop.endpoint = Schema.getAxapiURL(slbVirtualServerSchema.axapi, { name: cell });
      // pop.edit = true;
      // pop.modalProps.title = 'Edit Virtual Server';
      // console.log(cell, '..........');
      // FIXME
      return (<Link to={`${routeAlias.AdcVirtualServerEdit}?name=${cell}`}>{cell}</Link>);
    };

    const formatIp = (cell, row) => row['netmask'] ? `${cell} ${row['netmask']}` : cell;

    return (
      <Row>
        <Col xs={12}>
          <A10Table page responsive striped hover newLast loadOnInitial
            action={VirtualServerTable.url}
            searchField="name"
            dataKey="virtual-server-list"
            createModalOptions={{
              title: 'Create Virtual Server Template',
              bsSize:'super',
              form: VirtualServerForm
            }}>
            <A10TableColumn dataField="name" checkbox style={{ width:'20px' }} />
            <A10TableColumn dataField="name" style={{ width:'30%' }} render={formatName}>Name</A10TableColumn>
            <A10TableColumn dataField="ip-address" render={formatIp}>IP Address</A10TableColumn>
            <A10TableColumn dataField="enable-disable-action" render={formatStat} >Enable</A10TableColumn>
          </A10Table>
        </Col>
      </Row>
    );
  }
}

export default VirtualServerTable;
