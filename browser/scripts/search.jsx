import React from 'react';

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <form id="searchBox" method="GET" action={this.props.route} className="form-inline nav nav-center">
            <input type="text" name="q" placeholder="Rechercher..." className="form-control mdl-shadow--2dp"/>
            <button type="submit" className="btn btn-success-outline mdl-shadow--2dp"><i aria-hidden="true" className="fa fa-search"></i></button>
        </form>
    );
  }
}
SearchBox.defaultProps = {
    route: '/mediapiston/search'
}

export default SearchBox;

