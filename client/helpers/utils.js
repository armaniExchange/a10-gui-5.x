
export const createReducer = (key='app', reducers, defaultState=null) => {
  const reducer = (state=defaultState, action) => {
    const behavior = reducers[ action.type ];
    if (behavior) {
      try {
        const newState = behavior(state, action);
        return newState;
      } catch (e) {
        console.error(e);
        return state;
      }
    }
    return state;
  };
  return reducer;
};
