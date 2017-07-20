import React from 'react';
import Request from 'superagent';
import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Historique extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <p>Empruntée par {this.props.emprunteur} le {moment(this.props.date_emprunt).format("D MMMM YYYY")} avec {this.props.responsable_emprunt}<br/>
        Rendu le {moment(this.props.date_rendu).format("D MMMM YYYY")} avec {this.props.reponsable_rendu}</p>
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

    // Matériel emprunté au moment de l'affichage
    let nowEmprunte = emprunte && !this.props.showHistorique ? <p>Empruntée par {emprunt(index).nom} le {moment(emprunt(index).date).format("D MMMM YYYY")} avec {emprunt(index).responsable}</p> : null;
    let rendreCamera = emprunte && !this.props.showHistorique ? <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Rendre</button> : null;
    // Matériel réservé au moment de l'affichage
    let nowReserve = reserve ? <p>Réservée par {emprunt(index).nom} le {moment(emprunt(index).date).format("D MMMM YYYY")}</p> : null;
    let validerReservation = reserve && !this.props.showHistorique ? <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.validerReservation}>Valider réservation</button> : null;
    let annulerReservation = reserve && !this.props.showHistorique ? <button className="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" onClick={this.closeReservation}>Annuler réservation</button> : null;

    let reserver = !emprunteOuReserve && !this.props.showHistorique ? <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.openReservation}>Réserver</button> : null

    return (
        <div className="mdl-card display_card mdl-shadow--2dp" data-id={this.props._id}>
          <div className="mdl-card__title" style={{backgroundImage: 'url("/materiel/materiel/' + this.props._id + '.png")'}}>
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
            <p>Caution : {this.props.caution}€</p>
            {nowEmprunte}
            {nowReserve}
            {!emprunteOuReserve ? <p className="materielDispo">Disponible</p> : null}

            <ReactCSSTransitionGroup transitionEnterTimeout={600} transitionLeaveTimeout={600} transitionName="cardDescription">
              {cardDescription}
            </ReactCSSTransitionGroup>
          </div>
          <div className="mdl-card__actions mdl-card--border">
            {rendreCamera}
            {validerReservation}
            {annulerReservation}
            {reserver}
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
  caution: 300,
  disponible: true,
  historique: [],
  showHistorique: false,
  _id: Math.random()
};

class MatosList extends React.Component {
  constructor(props) {
    super(props);
    this.populate = this.populate.bind(this);

    this.state = props;
    //if (typeof props.route !== 'undefined') this.populate(props.route);
  }

  componentWillReceiveProps(props) {
    this.populate(props.route);
  }

  populate(route) {
    Request.get(route).end((err, data) => {
      data = data.body;
      this.setState({videoList: data});
    });
  }

  render() {
    if (this.props.matosList.length > 0)
      return (
        <div className="matosList">
          {this.props.matosList.map(cameraObject => {
            return <Camera {...cameraObject} key={cameraObject._id} />
          })}
        </div>
      );
    else
      return (
        <div className="alert alert-warning" role="alert">
          Il n'y a pas de matériel correspondant à ces critères...
        </div>
      );

  }
}
MatosList.defaultProps = {
  matosList: [
                {
                  caution: 400,
                  _id: Math.random()
                },
                {
                  name: 'GoPro Hero 3',
                  description: 'Caméra CTN moins bien',
                  disponible: false,
                  historique: [
                    {
                      emprunteur: 'Antonio de Jesus Montez',
                      date_emprunt: '2016-06-27',
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
                      date_emprunt: '2016-06-28',
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
                      date_emprunt: '2016-06-25',
                      valide: true,
                      responsable_emprunt: 'Akelo',
                      date_rendu: '2016-06-27',
                      reponsable_rendu: 'Khynder'
                    },
                    {
                      emprunteur: 'Julien Hoareau',
                      date_emprunt: '2016-06-27',
                      valide: true,
                      responsable_emprunt: 'Paypouz',
                      date_rendu: '2016-07-10',
                      reponsable_rendu: 'Kaths'
                    }
                  ],
                  showHistorique: true,
                  _id: Math.random()
                }
              ]
};


export default MatosList;
