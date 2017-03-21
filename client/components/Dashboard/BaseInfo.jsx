import React, { Component } from 'react';

import { widgetWrapper } from 'a10-widget';
import './assets/baseinfo/sass/index.scss';

class BaseInfo extends Component {

  static displayName = 'BaseInfo'

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="baseinfo-container">
        <label>Basic Information</label>
        <table className="table">
          <thead>
            <tr>
              <th>CPU</th>
              <th>Memory</th>
              <th>Disk Size</th>
              <th>CF</th>
              <th>SSL Card</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>18Pices</td>
              <td>10G</td>
              <td>Pri: 10G</td>
              <td>Pri: 1G</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>100Pices</td>
              <td></td>
              <td>Sec: 20G</td>
              <td>Sec: N/A</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default widgetWrapper([ 'app' ])(BaseInfo);
