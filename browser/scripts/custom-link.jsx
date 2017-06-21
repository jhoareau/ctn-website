import React from 'react';
import { Link } from 'react-router-dom';

class CustomLink extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let linkProps = Object.assign({}, this.props);
    delete linkProps.root;
    if (this.props.root)
        return <Link to={this.props.href} {...linkProps}>{this.props.children}</Link>
    else
        return <a {...linkProps}>{this.props.children}</a>
  }
}

export default CustomLink;
