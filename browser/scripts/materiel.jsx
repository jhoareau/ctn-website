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
      cardDescription =  <div className="card" key={"description"+this.props._id}>
                           <div className="card-block" >
                              <p className="card-text">{this.props.description}</p>
                           </div>
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
      <div className="cardWrapper">
        <div className="card" data-id={this.props._id}>
          <img className="card-img-top" src={this.props.thumbUrl} alt="Caméra" />
          <div className="card-block">
            <h4 className="card-title">{this.props.name}</h4>
            <p className="card-text">Caution : {this.props.caution}</p>
            {/* Empruntée dans le présent */}
            {emprunte ? <p className="card-text">Empruntée par {emprunt(index).nom} le {emprunt(index).date}
                                                               <br/>Responsable : {emprunt(index).responsable}</p> : null}
            {/* Empruntée dans le présent */}
            {emprunte ? <button className="btn btn-danger" onClick={this.closeReservation}>Rendre matériel</button> : null}
            {/* Réservée */}
            {reserve ? <p className="card-text">Réservée par {emprunt(index).nom} le {emprunt(index).date}</p> : null}
            {reserve ? <button className="btn btn-success" onClick={this.validerReservation}>Valider réservation</button> : null}
            {reserve ? <button className="btn btn-danger" onClick={this.closeReservation}>Annuler réservation</button> : null}
            {/* Emprunté dans le passé */}
            {/*this.props.rendu_le ? <p className="card-text">Rendu le {this.props.rendu_le} avec {this.props.responsable_rendu}</p> : null*/}
            {/* Ni emprunté ni réservé */}
            {!emprunteOuReserve ? <p className="card-text materielDispo">Disponible !</p> : null}
            {!emprunteOuReserve ? <button className="btn btn-primary" onClick={this.openReservation}>Réserver</button> : null}
          </div>
          <div className="card-block openDescription" onClick={this.switchDescription}>
            <span className="text-muted link">Plus de détails...</span>
          </div>
        </div>
        <ReactCSSTransitionGroup transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionName="cardDescription" className="card cardHidden">
          {cardDescription}
        </ReactCSSTransitionGroup>

      </div>
    );
  }
}
Camera.defaultProps = {
  thumbUrl : '/defaults/gopro_4.jpg',
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
