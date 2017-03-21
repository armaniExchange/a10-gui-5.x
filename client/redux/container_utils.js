import { bindActionCreators  } from 'redux';

import ActionCreators from './modules/actionCreators';

export function mapStateToProps(state) {
  return {
    app: state
  };
}

export function mapDispatchToProps(dispatch) {
  const result = { actions: {} };
  for (const moduleKey in ActionCreators) {
    result.actions[moduleKey] = bindActionCreators(ActionCreators[moduleKey], dispatch)
  }
  return result;
}
