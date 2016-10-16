import React from 'react';

export default class Error extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <section style={{position: "fixed", top: "50vh", width: "50%", left: "50vw", transform: "translate(-50%, -50%)"}}>
          <div className="alert alert-danger"><strong>Erreur !</strong><br /><span>{this.props.err}</span></div>
        </section>
    );
  }
}

Error.defaultProps = {
    err: 'Page non trouvée !'
}