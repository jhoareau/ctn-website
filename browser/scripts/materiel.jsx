import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Historique extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <p>
        <p>Empruntée par {this.props.emprunteur} le {this.props.date_emprunt} avec {this.props.responsable_emprunt}<br/>
        Rendu le {this.props.date_rendu} avec {this.props.reponsable_rendu}</p>
      </p>
    );
  }
}

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
      cardDescription =    <div key={'desc'+this.props._id}>
                              <p>{this.props.description}</p>
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
          {
            !this.props.showHistorique ?
              <div className="mdl-card__menu">
                <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored mdl-js-ripple-effect" onClick={this.switchDescription}>
                  <i className="material-icons">description</i>
                </button>
              </div>
            : null
          }
          <div className="mdl-card__supporting-text">
            <p>Caution : {this.props.caution}</p>
            {/* Empruntée dans le présent */}
            {emprunte && !this.props.showHistorique ? <p>Empruntée par {emprunt(index).nom} le {emprunt(index).date} avec {emprunt(index).responsable}</p> : null}

            {/* Réservée dans le présent */}
            {reserve ? <p>Réservée par {emprunt(index).nom} le {emprunt(index).date}</p> : null}

            {/* Ni emprunté ni réservé */}
            {!emprunteOuReserve ? <p className="materielDispo">Disponible</p> : null}
            <ReactCSSTransitionGroup transitionEnterTimeout={600} transitionLeaveTimeout={600} transitionName="cardDescription">
              {cardDescription}
            </ReactCSSTransitionGroup>
          </div>
          <div className="mdl-card__actions mdl-card--border">
            {/* Empruntée dans le présent */}
            {emprunte && !this.props.showHistorique ? <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Rendre</button> : null}
            {/* Réservée */}
            {reserve && !this.props.showHistorique ? <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.validerReservation}>Valider réservation</button> : null}
            {reserve && !this.props.showHistorique ? <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.closeReservation}>Annuler réservation</button> : null}
            {/* Ni emprunté ni réservé */}
            {!emprunteOuReserve && !this.props.showHistorique ? <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.openReservation}>Réserver</button> : null}
            {/* Emprunté dans le passé */}
            {this.props.showHistorique ? this.props.historique.reverse().map(histoObject => {
              return <Historique {...histoObject} key={JSON.stringify(histoObject)} />;
            }) : null}
          </div>
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
  showHistorique: false,
  _id: Math.random()
};

class MatosList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="matosList">
        {this.props.matosList.map(cameraObject => {
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
                },
                {
                  name: 'GoPro Hero 3',
                  description: 'Caméra CTN moins bien',
                  disponible: false,
                  historique: [
                    {
                      emprunteur: 'Antonio de Jesus Montez',
                      date_emprunt: '25/06/2016',
                      valide: true,
                      responsable_emprunt: 'Akelo',
                      date_rendu: '27/06/2016',
                      reponsable_rendu: 'Khynder'
                    },
                    {
                      emprunteur: 'Julien Hoareau',
                      date_emprunt: '28/06/2016',
                      valide: true,
                      responsable_emprunt: 'Paypouz',
                      date_rendu: '10/07/2016',
                      reponsable_rendu: 'Kaths'
                    }
                  ],
                  showHistorique: true,
                  _id: Math.random()
                }
              ]
};


export default MatosList;
