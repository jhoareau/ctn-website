import React from 'react';
import { Redirect } from 'react-router-dom';

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {redirectTo: false};
  }

  componentDidMount() {
    this.refs.searchBox.addEventListener('submit', event => {
      event.preventDefault();
      if (this.refs.term.value !== '') this.setState({redirectTo: true});
    });
  }

  render() {
    let form =
      <form ref="searchBox" id="searchBox" method="GET" action={this.props.route} className="form-inline nav nav-center">
          <input type="text" ref="term" placeholder="Rechercher..." className="form-control mdl-shadow--2dp"/>
          <button type="submit" className="btn btn-success-outline mdl-shadow--2dp"><i aria-hidden="true" className="fa fa-search"></i></button>
      </form>;
    return (
      this.state.redirectTo ? this.refs ? <Redirect to={'/mediapiston/search/' + this.refs.term.value} push={true} /> : form : form
    );
  }
}
SearchBox.defaultProps = {
    route: '/mediapiston/search'
}
SearchBox.contextTypes = {
  router: React.PropTypes.object
}

export default SearchBox;
