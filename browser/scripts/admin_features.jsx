import React from 'react';
import Request from 'superagent';

class AdminFeatures extends React.Component {
  constructor(props) {
    super(props);
    this.populate = this.populate.bind(this);
    this.state = props;

    if (typeof props.route !== 'undefined') this.populate(props.route);
  }
  populate(route) {
    Request.get(route).end((err, data) => {
      data = data.body;
      this.setState({links: data});
    });
  }
  render() {
    if (this.state.links.length === 0) return null;
    return (
        <div className="adminFeatures">
          {
            this.state.links.map(link => {
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
