import { actionTypes } from 'redux-form/immutable'; 
import { Map, Iterable } from 'immutable';
// import { isEqual } from 'lodash';
import { getFormVar, getPageVar } from 'helpers/stateHelper';
import { APP_CURRENT_PAGE } from 'configs/appKeys';

import { REGISTER_PAGE_FIELD, SYNC_PAGE_FIELD } from 'redux/modules/actionTypes'; //CHANGE

const empty = Map({});

class FormHacker {

  constructor(state, action, next) {
    this.state = state;
    this.next = next;
    this.action = action;
  }

  workaround() {
    let action = this.action;
    switch(this.action.type) {      
      case REGISTER_PAGE_FIELD:
        //initial visible
        this.dispatchValidation();
        action = this.reinitialConditional();
        break;
      case actionTypes.CHANGE:   
        this.changeConditional();
        break;
      case actionTypes.BLUR:         
      case actionTypes.START_SUBMIT: //eslint-disable-line
        this.dispatchValidation();
        break;
    }
    return action;
  }

  dispatchValidation() {
    const pageEnv = this.state.getIn([ 'app', APP_CURRENT_PAGE ]);
    const pageVar = getPageVar(this.state, pageEnv.page);
    const reduxFormVar = getFormVar(this.state, pageEnv.form);

    if (pageVar && reduxFormVar) {
      const syncErrors = this.validate(pageVar, reduxFormVar);      
      const errors = syncErrors.isEmpty() ? false : syncErrors.toJS();
      this.next({ type: actionTypes.UPDATE_SYNC_ERRORS, meta: { form: pageEnv.form }, payload: { syncErrors: errors, error: false } });
    }
    return this.action;
  }

  validate(pageVar, reduxFormVar) {
    let result = Map({});
    const pageValidators = pageVar.getIn([ 'form' ]);
    // console.log(pageValidators, '=======================pageValidators');

    pageValidators.forEach((field, name) => {
      if (Iterable.isIterable(field)) {
        const validations = field.getIn([ 'validations' ], empty);
        if (validations && Iterable.isIterable(validations)) {
          const thisValues = reduxFormVar.getIn([ 'values' ]) || reduxFormVar.getIn([ 'initial' ]);
          const elementValue = thisValues.getIn( name.split('.') );
          // console.log('validations is Iterable..............', validations, Iterable.isIterable(validations));        
          validations.forEach((func, k) => { // eslint-disable-line
            const msg = func(elementValue, name, reduxFormVar, pageVar);
            // console.log(msg, elementValue, name);
            if (msg) {
              result = result.setIn(name.split('.'), msg);
              return msg;
            }
          });
        }
      }
    });
    return result;
  }

  _isElementVisible(depValue, conditionalObjValue) {
    return depValue === true ? !!conditionalObjValue :
             ( depValue === false ? !conditionalObjValue : depValue === conditionalObjValue);
  }

  reinitialConditional() {
    const pageEnv = this.state.getIn([ 'app', APP_CURRENT_PAGE ]);
    const pageVar = getPageVar(this.state, pageEnv.page);
    const reduxFormVar = getFormVar(this.state, pageEnv.form);

    if (pageVar && reduxFormVar) {
      const name = this.action.field;
      let conditional = this.action.payload.getIn([ 'conditionals' ]);
      const getElementValue = (fieldName) => reduxFormVar.getIn([ 'values', ...fieldName.split('.') ]);
      const cachedValue = getElementValue(name);
      let isVisible = true;
      if (Iterable.isIterable(conditional)) {
        const depName = conditional.getIn([ 'dependOn' ], '');
        const depValue = conditional.getIn([ 'dependValue' ], null); 
        const depOnObjVisible = pageVar.getIn([ 'form', depName, 'conditionals', 'visible' ], true);
        // console.log(name, 'depend on visible ', depName, depOnObjVisible);
        if (depOnObjVisible && depName) {
          const conditionalObjValue = getElementValue(depName);
          if (typeof depValue == 'function') {
            isVisible = depValue.call(null, conditionalObjValue, reduxFormVar);
          } else {
            isVisible = this._isElementVisible(depValue, conditionalObjValue);
          }
        } else if (depName) {
          isVisible = false;
        }

        // const cond = Map({ visible: isVisible, cachedValue: cachedValue, dependOn: depName, dependValue: depValue };
        conditional = conditional.setIn([ 'visible' ], isVisible);
        conditional = conditional.setIn([ 'cachedValue' ], cachedValue);
        // console.log('conditional', conditional);
        this.action.payload = this.action.payload.setIn([ 'conditionals' ], conditional);
      }
    } 

    return this.action;
  }

  changeConditional() {
    const pageEnv = this.state.getIn([ 'app', APP_CURRENT_PAGE ]);
    const pageVar = getPageVar(this.state, pageEnv.page);
    const reduxFormVar = getFormVar(this.state, pageEnv.form);
    const fields = pageVar.getIn([ 'form' ]);
    let storedBackFields = Map({});

    const setVisible = (elements, parentFieldName, parentIsVisible, conditionalObjValue) => {
      elements.forEach((element, elementName) => {
        if (Iterable.isIterable(element)) {
          let result = element;
          const depOn = element.getIn([ 'conditionals', 'dependOn' ]);
          const depValue = element.getIn([ 'conditionals', 'dependValue' ]);

          // only find those field name depend on current changing field name          
          if (depOn === parentFieldName) {
            let isNewVisible = parentIsVisible;
            if (typeof depValue == 'function') {
              isNewVisible = isNewVisible && depValue.call(null, conditionalObjValue, reduxFormVar);
            } else {
              isNewVisible = isNewVisible && this._isElementVisible(depValue, conditionalObjValue);
            }

            // for debugging
            // console.log(elementName, 'depOn:', depOn, 'depValue:', depValue, 'conditionalObjValue:', conditionalObjValue, 'parentIsVisible:', parentIsVisible, 'isNewVisible:', isNewVisible);

            result = result.deleteIn([ 'validations' ]);
            result = result.setIn([ 'conditionals', 'visible'  ], isNewVisible);
            storedBackFields = storedBackFields.setIn([ elementName ], result);
            let newConditionalObjValue = reduxFormVar.getIn([ 'values', ...elementName.split('.') ]);            
            setVisible(elements, elementName, isNewVisible, newConditionalObjValue);
            return true;
          }
        }
      });
    };

    setVisible(fields, this.action.meta.field, fields.getIn([ this.action.meta.field, 'conditionals', 'visible' ]), this.action.payload);

    // console.log('storedBackFields...................', storedBackFields);
    this.next({ type: SYNC_PAGE_FIELD, page: pageEnv.page, payload: storedBackFields });
  }

}

export default ({ getState }) => { // eslint-disable-line dispatch //
  return next => action => {
    const state = getState();
    let hacker = new FormHacker(state, action, next);
    let newAction = hacker.workaround();
    // console.log('hacker', newAction);

    // console.log('............. on form middleware ...............', getState().toJS(), 'state',  action, 'action');    
    return next(newAction);
  };
};
