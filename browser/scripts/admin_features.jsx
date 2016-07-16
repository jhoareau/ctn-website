import React from 'react';

class AdminFeatures extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.links.length === 0) return null;
    return (
        <div className="adminFeatures">
          {
            this.props.links.map(link => {
              return (<a className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" href={link.href} key={link.href}>
                {link.title}
              </a>);
            })
          }
        </div>
    );
  }
}
AdminFeatures.defaultProps = {
  links: []
};

export default AdminFeatures;
