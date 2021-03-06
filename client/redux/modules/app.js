/** app reducer data structure **/
/*
APP
  Theme
     Effective
    Layout
  Page
    API Data

  Feature
*/

/* eslint-disable */
import { Map, fromJS } from 'immutable';
import pageReducers from './app/page';
import themeReducers from './app/theme';

const behaviors = {
  ...pageReducers,
  ...themeReducers
};

const empty = Map({});

const createReducer = () => {
  const reducer = (state = empty, action) => {
    const behavior = behaviors[ action.type ]
    return behavior ? behavior(state, action) : state
  }

  return reducer;
};


export default createReducer();
