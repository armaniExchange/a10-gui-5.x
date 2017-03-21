import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
// import { forEach, uniqueId } from 'lodash';
// import pubsub from 'pubsub-js';
import SidebarRun from './jsx/Layout/Sidebar.run';

// import './scss/Menu.scss';
// const List = ({ children, className }) => {
//   return <li className={ className }> { children } </li>;
// };

class MenuLayout extends React.Component {

  static propTypes = {
    menus: PropTypes.array.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      userBlockCollapse: false,
      collapse: [],
      menus: this.initMenuStructure(props.menus)
    };
    this.icons = {
      'Dev': 'icon-wrench',
      'ADC': 'icon-layers',
      'Dashboard': 'icon-speedometer',
      'Security': 'icon-shield'
    };
  }

  initMenuStructure(menus) {
    const result = {};
    for (let i = 0; i < menus.length; i++) {
      const { menuPath, path } = menus[i];
      let currentRef = result;
      for (let j = 0; j < menuPath.length; j++) {
        if (j === menuPath.length - 1) {
          currentRef[menuPath[j]] = path;
        } else {
          if (!currentRef[menuPath[j]]) {
            currentRef[menuPath[j]] = {};
          }
          currentRef = currentRef[menuPath[j]];
        }
      }
    }
    return result;
  }

  toggleItemCollapseByUrl = (url, menus, prefix='root') => {
    Object.keys(menus).map((menuKey, index) => {
      const item = menus[menuKey];
      const currentPath = `${prefix}@${menuKey}`;
      if (typeof item === 'string') {
        if (item === url) this.toggleItemCollapse(currentPath);
      } else {
        this.toggleItemCollapseByUrl(url, item, currentPath);
      }
    });
  };

  toggleItemCollapse = (currentPath, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({
      collapse: currentPath
    });
  };

  renderMenuItems(menus, prefix='root') {
    return Object.keys(menus).map((menuKey, index) => {
      const item = menus[menuKey];
      if (typeof item === 'string') {
        return (
          <li key={index}>
            <Link to={item} title={menuKey}>
              <span>{menuKey}</span>
            </Link>
          </li>
        );
      } else {
        const { collapse } = this.state;
        let currentPath = '';
        if (prefix === '') {
          currentPath = `${menuKey}`;
        } else {
          currentPath = `${prefix}@${menuKey}`;
        }
        return (
          <li key={index}>
            <div className="nav-item" onClick={this.toggleItemCollapse.bind(this, currentPath)}>
              <em className={this.icons[menuKey] || 'fa fa-caret-right'}></em>
              <span data-localize={'sidebar.nav.' + menuKey}>{menuKey}</span>
            </div>
            <Collapse in={collapse.indexOf(menuKey) > -1} timeout={100}>
              <ul id={menuKey} className="nav sidebar-subnav">
                <li className="sidebar-subnav-header">{menuKey}</li>
                { this.renderMenuItems(item, currentPath) }
              </ul>
            </Collapse>
          </li>
        );
      }
    });
  };

  componentDidMount() {
    SidebarRun();
    const {
      router: {
        route: {
          location: { pathname }
        }
      }
    } = this.context;
    this.toggleItemCollapseByUrl(pathname, this.state.menus);
  }

  render() {
    return (
      <aside className='aside'>
          <div className="aside-inner">
              <nav data-sidebar-anyclick-close="" className="sidebar">
                  <ul className="nav">
                      <li className="nav-heading ">
                          <span data-localize="sidebar.heading.HEADER">Main Navigation</span>
                      </li>
                      {this.renderMenuItems(this.state.menus)}
                  </ul>
              </nav>
          </div>
      </aside>
    );
  }

}
export default MenuLayout;
