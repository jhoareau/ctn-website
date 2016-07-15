import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.switchDescription = this.switchDescription.bind(this);
    this.validerReservation = this.validerReservation.bind(this);
    this.closeReservation = this.closeReservation.bind(this);

    this.state = {description: false};
  }
  switchDescription() {
    this.setState({description: !this.state.description});
    this.forceUpdate();
  }
  validerReservation() {

  }
  closeReservation() {

  }
  render() {
    let cardDescription = null;
    if (this.state.description) {
      cardDescription =    <div className="card-block">
                              <p className="card-text">{this.props.description}</p>
                           </div>;
    }


    let emprunteOuReserve = !this.props.disponible;
    let index = 0;
    let emprunte = emprunteOuReserve && this.props.historique.length !== 0 && this.props.historique.reverse()[0].valide;
    let reserve = emprunteOuReserve && (this.props.historique.length === 0 || !this.props.historique.reverse()[0].valide);
    // Pour accéder à l'historique
    let emprunt = i => {
      return {
        nom: this.props.historique.reverse()[i].emprunteur,
        date: this.props.historique.reverse()[i].date_emprunt,
        responsable: this.props.historique.reverse()[i].responsable_emprunt
      }
    };

    return (
        <div className="mdl-card mdl-shadow--2dp" data-id={this.props._id}>
          <div className="mdl-card__title" style={{backgroundImage: 'url(' + this.props.thumbUrl + ')'}}>
            <h2 className="mdl-card__title-text">{this.props.name}</h2>
          </div>
          <div className="mdl-card__menu">
            <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
              <i className="material-icons">description</i>
            </button>
          </div>
          <div className="mdl-card__supporting-text">
            <p className="card-text">Caution : {this.props.caution}</p>
            {/* Empruntée dans le présent */}
            {emprunte ? <p className="card-text">Empruntée par {emprunt(index).nom} le {emprunt(index).date}
                                                               <br/>Responsable : {emprunt(index).responsable}</p> : null}


            {reserve ? <p className="card-text">Réservée par {emprunt(index).nom} le {emprunt(index).date}</p> : null}

            {/* Emprunté dans le passé */}
            {/*this.props.rendu_le ? <p className="card-text">Rendu le {this.props.rendu_le} avec {this.props.responsable_rendu}</p> : null*/}
            {/* Ni emprunté ni réservé */}
            {!emprunteOuReserve ? <p className="card-text materielDispo">Disponible</p> : null}

          </div>
          <div className="mdl-card__actions mdl-card--border">
            {/* Empruntée dans le présent */}
            {emprunte ? <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Rendre</button> : null}
            {/* Réservée */}
            {reserve ? <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.validerReservation}>Valider réservation</button> : null}
            {reserve ? <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.closeReservation}>Annuler réservation</button> : null}
            {/* Ni emprunté ni réservé */}
            {!emprunteOuReserve ? <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.openReservation}>Réserver</button> : null}
          </div>
          {cardDescription}
      </div>
    );
  }
}
Camera.defaultProps = {
  thumbUrl : '/defaults/gopro_4.png',
  name: 'Clara - GoPro Hero 4',
  description: 'Caméra CTN',
  caution: '300€',
  disponible: true,
  historique: [],
  showHistorique: true,
  _id: Math.random()
};

class MatosList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="matosList">
        {this.props.matosList.map((cameraObject) => {
          return <Camera {...cameraObject} key={JSON.stringify(cameraObject)} />
        })}
      </div>
    );
  }
}
MatosList.defaultProps = {
  matosList: [
                {
                  caution: '400€',
                  _id: Math.random()
                },
                {
                  name: 'GoPro Hero 3',
                  description: 'Caméra CTN moins bien',
                  disponible: false,
                  historique: [
                    {
                      emprunteur: 'Antonio de Jesus Montez',
                      date_emprunt: '27/06/2016',
                      valide: false
                    }
                  ],
                  _id: Math.random()
                },
                {
                  name: 'GoPro Hero 3',
                  description: 'Caméra CTN moins bien',
                  disponible: false,
                  historique: [
                    {
                      emprunteur: 'Antonio de Jesus Montez',
                      date_emprunt: '28/06/2016',
                      valide: true,
                      responsable_emprunt: 'Akelo'
                    }
                  ],
                  _id: Math.random()
                }
              ]
};


export default MatosList;
