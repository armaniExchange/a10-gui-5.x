import { PropTypes } from 'react';

import { WIDGET_MIDDLEWARE } from '../configs/app';

export default function rbacTransform() {
  return function wrap(ReactClass) {
    const originalRender = ReactClass.prototype.render;

    ReactClass.contextTypes = {
      ...ReactClass.contextTypes,
      store: PropTypes.object
    };

    ReactClass.prototype.render = function render() {
      if (originalRender) {
        let Component =  originalRender.apply(this);
        console.log(this.context);
        if (this.context && this.context.store) {
          const state = this.context.store.getState();
          for (let i = 0; i < WIDGET_MIDDLEWARE.length; i++) {
            const newComponent = WIDGET_MIDDLEWARE[i](Component, state);
            if (newComponent !== undefined) {
              Component = newComponent;
            }
          }
        }
        return Component;
      }
      return null;
    };

    return ReactClass;
  };
}
