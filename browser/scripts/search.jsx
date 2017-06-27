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
      if (this.refs.term.value !== '') {
        this.setState({redirectTo: true});
        setTimeout(() => {
          this.setState({redirectTo: false});
        }, 2000);
      }
    });
  }

  render() {
    let form =
      <form ref="searchBox" id="searchBox" className="form-inline nav nav-center">
          <input type="text" ref="term" placeholder="Rechercher..." className="form-control mdl-shadow--2dp"/>
          <button type="submit" className="btn btn-success-outline mdl-shadow--2dp"><i aria-hidden="true" className="fa fa-search"></i></button>
      </form>;
    return (
      this.state.redirectTo ? this.refs && this.refs.term ? <Redirect to={this.props.route + this.refs.term.value} push={true} /> : form : form
    );
  }
}
SearchBox.defaultProps = {
    route: '/mediapiston/search'
}

export default SearchBox;
