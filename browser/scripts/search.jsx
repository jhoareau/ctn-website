import React from 'react';

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.refs.searchBox.addEventListener('submit', event => {
      event.preventDefault();
      this.context.router.transitionTo('/mediapiston/search/' + this.refs.term.value);
    });
  }

  render() {
    return (
        <form ref="searchBox" id="searchBox" method="GET" action={this.props.route} className="form-inline nav nav-center">
            <input type="text" ref="term" placeholder="Rechercher..." className="form-control mdl-shadow--2dp"/>
            <button type="submit" className="btn btn-success-outline mdl-shadow--2dp"><i aria-hidden="true" className="fa fa-search"></i></button>
        </form>
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

