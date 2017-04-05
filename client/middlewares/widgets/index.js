import React from 'react';

function recursiveCheck(component) {
  if (React.isValidElement(component) && component.type.displayName === 'A10SubmitButtons') {
    return null;
  }

  const { children } = component.props;
  if (children && Array.isArray(children)) {
    React.Children.forEach(children, (child, index) => {
      const newChild = recursiveCheck(child);
      if (newChild !== child) {
        const childrenCopied = [ ...children ];
        childrenCopied[index] = newChild;
        component = React.cloneElement(component, {
          children: childrenCopied
        });
      }
    });
  } else if (React.isValidElement(children)) {
    const newChild = recursiveCheck(children);
    if (children !== newChild) {
      component = React.cloneElement(component, { children: newChild });
    }
  }

  return component;
}

// props
export const VCS = (Component, state) => {
  const { isVCSMaster } = state.get('globalVar');
  if (React.isValidElement(Component) && !isVCSMaster) {
    if (Component.type.displayName === 'A10Form') {
      return recursiveCheck(Component);
      // React.Children.map(Component.)
    }
  }
};
