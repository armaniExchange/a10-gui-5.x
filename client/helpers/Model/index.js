import invariant from 'invariant';
import { isArray, forEach, set, get } from 'lodash';

import { getPayload } from 'helpers/axapiHelper';
import { axapiRequest } from 'redux/modules/app/axapi';
import Schema from 'helpers/Schema';
import { setComponentState } from 'redux/modules/app/component';
import { getResponseBody } from 'helpers/axapiHelper';
import MetaParser from 'helpers/Model/MetaParser';

/**
 * Model data stored at component manager's path tree
 */
export default class Model {
  _requestCache = {}

  constructor(cm, instancePath, dispatch) {
    // save cm manager as all other cm
    this.cm = cm;
    this.dispatch = dispatch;
    this.instancePath = instancePath;
    this.node = this.cm.getNode(this.instancePath);
    // this._initialize();
    if (!this.node) {
      invariant(this.node, ' does not exists on component tree');
    }

    if (this.node.modelmeta && this.node.meta.schema) {
      this.node.model.schemaParser = new Schema(this.node.meta.schema);
    } else {
      // find parent schema parser
      this.node.model.schemaParser = this._getParentSchemaParser(this.node);
    }
    this.metaParser = new MetaParser(this);
  }

  // only for constructor
  _getParentSchemaParser(node) {
    if (node.parent && node.parent.schemaParser) {
      return node.parent.schemaParser;
    } else if (node.parent) {
      return this._getParentSchemaParser(node.parent);
    } else {
      return null;
    }
  }

  initialize() {
    // console.log(this.node.model);
    const model = this.node.model;
    let initialState = { invalid: false, visible: true };
    if (model.meta && model.meta.initial) {
      initialState['active-data'] = model.meta.initial;
      model.value = model.meta.initial;
    } else if (model.value) {
      initialState['active-data'] = model.value;
    }

    this.dispatch(setComponentState(this.instancePath, initialState));

    if (get(model, 'meta.loadInitial', false)) {
      this.pullData();
    }

    this.metaParser.initialize();
  }

  _syncDataToRedux(data, instancePath=null) {
    // console.log(this.instancePath, data);
    if (!instancePath) instancePath = this.instancePath;
    this.dispatch(setComponentState(instancePath, data));
  }

  setModel(values, sync=false) {
    this._setModel(values, this.instancePath, sync);
  }

  _setModel(values, instancePath, sync=false) {
    const thisNode = this.cm.getNode(instancePath);

    thisNode.model = Object.assign({}, thisNode.model, values);
    if (values.initial) {
      // this._setValue(values.initial, instancePath);
      values.value = values.initial;
    }

    if (sync) {
      this._syncDataToRedux(values, instancePath);
    }
  }

  getModel(key='') {
    // const this.node = this.cm.getNode(this.instancePath);
    return key ? this.node.model[key] : this.node.model;
  }

  _setValue(value, instancePath) {
    this._setModel({ value }, instancePath);
    this._syncDataToRedux({ 'active-data': value }, instancePath);
  }

  setValue(value, checkConditional=true) {
    this._setValue(value, this.instancePath);
    checkConditional && this.metaParser.changeConditional();
  }

  _setVisible(visible, instancePath, invalidValue=true) {
    let initialState = { invalid: invalidValue && !visible, visible };
    this._setModel(initialState, instancePath, true);
  }

  setVisible(visible, invalidValue=true) {
    this._setVisible(visible, this.instancePath, invalidValue);
  }

  setInvalid(invalid=true) {
    this.setModel({ invalid });
    this._syncDataToRedux({ 'invalid': invalid }, this.instancePath);
  }

  getMeta() {
    return this.getModel('meta');
  }

  getValue() {
    return this.getModel('value');
  }

  getInvalid() {
    return this.getModel('invalid');
  }

  _parseBody(body) {
    let content = {};
    forEach(body, (data, key) => {
      if (key.indexOf('x.') !== 0) {
        set(content, key, data);
      }
    });
    return content;
  }

  getRequests(method) {
    // try to find self meta to see if it savable
    // const this.node = this.cm.getNode(this.instancePath);
    if (!this.node.model.meta) {
      return false;
    }

    let requests = {};
    const getRequest = (node, validParentUrl='') => {
      let nodes = node;
      if (!isArray(node)) {
        nodes = [ node ];
      }
      // if explictly provide endpoint
      nodes.forEach((n) => {
        // console.log(n);
        if (n.model.meta) {
          let meta = n.model.meta, value = n.model.value;
          let url = '', name = '';
          if (meta.endpoint) {
            url = meta.endpoint;
            name = meta.name;
          } else if ( n.model.schemaParser ) {
            // let { schema } = meta;
            // console.log(meta);
            // const schemaObj = new Schema(schema);
            url = n.model.schemaParser.getAxapiURL(meta.urlParams) || '';
            name = meta.name;
          } else if (validParentUrl) {
            url = validParentUrl;
            value = n.model.value;
            name = n.model.meta.name;
            // console.log(value, url, name);
          }

          // console.log('url:', url, 'name:', name, ' value: ', value);
          if (name && value !== undefined && requests[url]) {
            requests[url] = Object.assign({}, requests[url], { [ name ] : value });
          } else {
            requests[url] = {};
          }
          validParentUrl = url;
        }

        if (n.children.length) {
          // console.log(n.children);
          getRequest(n.children, validParentUrl);
        }
      });
    };
    getRequest(this.node);

    // parse requests as real request
    let finalRequests = [];
    // console.log(requests);

    forEach(requests, (body, url) => {
      let payload = null;
      if (body) {
        body = this._parseBody(body);
        payload = getPayload(url, method, body);
        finalRequests.push(payload);
      }
    });

    // console.log(finalRequests);
    return finalRequests;
  }

  _pullDataToNode(body, node) {
    // console.log(body, node);
    if (!body || !node)  return false;

    if (node.children.length) {
      node.children.forEach((n) => {
        this._pullDataToNode(body, n);
      });
    } else {
      const value = get(body, node.model.meta.name);
      // console.log(value, node.model.meta.name);
      if (value !== undefined) {
        this._setValue(value, node.model.instancePath);
      }
    }
  }

  // pull data for inintial
  pullData() {
    let requests = this.getRequests('GET');
    // console.log(requests);
    const setModel = (body) => {
      // console.log(body, this.node.model.meta.name);
      // keep name same as redux component 'data'
      // active-data correspond model value
      this.setModel({ data: body });
      this._pullDataToNode(body, this.node);
    };
    // console.log(requests, '.............................');
    if (!requests.length) {
      console.error('cannot PULL Data because this element ', this.instancePath, ' is not set endpoint');
    } else {
      let validRequests = requests.filter((req) => {
        // TODO: unit test with cache data
        if (this._requestCache[req.path]) {
          setModel(this._requestCache[req.path]);
        }
        return !this._requestCache[req.path];
      });

      if (validRequests.length) {
        const result = this.dispatch(axapiRequest(this.instancePath, validRequests, false));
        result.then((resp) => {
          const mapResp = (r) => {
            // console.log(r);
            const body = getResponseBody(r);
            this._requestCache[r.req.url] = body;
            // keep name same as redux component 'data'
            // active-data correspond model value
            // this.setModel({ data: body });
            // this._pullDataToNode(body, this.node);
            setModel(body);
          };

          if (isArray(resp)) {
            resp.forEach(mapResp);
          } else {
            mapResp(resp);
          }
        });
      }

    }
  }

  pushData( method='POST', notifiable=false) {
    return this.save( method, notifiable);
  }

  /**
   * Save data to end point
   */
  save(method='POST') {
    // try to find self meta to see if it savable
    let requests = this.getRequests(method);
    // console.log(requests, '.............................');
    if (!requests.length) {
      console.error('cannot save because this element ', this.instancePath, ' is not set endpoint');
    } else {
      const result = this.dispatch(axapiRequest(this.instancePath, requests, false));
      result.then(() => {
        this.setInvalid(true);
        // this.setInvalid();
      });
    }
  }

}
