import React, { PropTypes } from 'react';
import { A10Field, A10Form, A10FormControl } from 'a10-widget';
import { required } from 'a10-widget-lib';

class LoginForm extends React.Component {

  static displayName = 'LoginForm';

  static contextTypes = {
    router: PropTypes.object.isRequired,
    apiClient: PropTypes.object.isRequired,
    appRouteRule: PropTypes.object.isRequired
  };

  isFirstLogin() {
    const cookieVal = document.cookie;
    const cookieItems = cookieVal.split(';');
    for (let i = 0; i < cookieItems.length; i++) {
      const item = cookieItems[i];
      const result = item.match(/isFirst=(.*)/);
      if (result && result[1] === 'false') return false;
    }
    return true;
  }

  login = (data, e) => {
    e.preventDefault();
    const {
      actions: {
        app: { setNotification, setGlobalVar }
      }
    } = this.props;
    this.context.apiClient.post('/axapi/v3/auth', data).then(res => {
      const { appRouteRule, router } = this.context;
      setGlobalVar('authToken', res.authresponse.signature);
      router.history.push(appRouteRule.CommonWelcomeIndex);
    });
  };

  render() {
    return (
      <div>
        <A10Form bsClass="mb-lg" onSubmit={this.login}>
          <div>
            <A10Field
              name="credentials.username"
              validation={required}>
              <A10FormControl placeholder="Enter Username" autoComplete="off"/>
            </A10Field>
            <A10Field
              name="credentials.password"
              validation={required}>
              <A10FormControl type="password" placeholder="Enter Password" autoComplete="off"/>
            </A10Field>
          </div>
          <div>
            <button key="submit" type="submit" className="btn btn-block btn-primary mt-lg">Submit</button>
          </div>
        </A10Form>
      </div>
    );
  }
}
export default LoginForm;
