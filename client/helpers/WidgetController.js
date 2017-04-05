import React from 'react';
import { connect } from 'react-redux';

import { mapStateToProps, mapDispatchToProps } from '../redux/container_utils';

const controlWidget = middlewares => (Layout, Page) => {

  class WidgetController extends React.Component {

    static displayName = 'WidgetController';

    recursiveCloneA10Field(child) {
      return React.Children.map(child, ele => {
        if (!React.isValidElement(ele)) {
          console.log(1, ele);
          return ele;
        } else if (ele.props.children) {
          console.log(2, ele);
          return React.cloneElement(ele, {
            children: this.recursiveCloneA10Field(ele.props.children),
            ...this.props
          });
        }
        return ele;
      });
    }

    componentDidMount() {
      console.log(this.refs.a);
    }

    render() {
      // React.Children.map(Page, child => {
      //   console.log(child);
      //   return child;
      // });
      // const a = <Page ref="test" {...this.props} />;
      console.log(middlewares);
      return <Page {...this.props} ref="a" />;
    }

  }

  const Container = connect(mapStateToProps, mapDispatchToProps)(WidgetController);
  return (
    <Layout>
      <Container />
    </Layout>
  );
};
export default controlWidget;
