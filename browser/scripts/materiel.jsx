import React from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';

class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.openDescription = this.openDescription.bind(this);
    this.closeDescription = this.closeDescription.bind(this);
    this.validerReservation = this.validerReservation.bind(this);
    this.closeReservation = this.closeReservation.bind(this);

    this.state = {description: false};
  }
  openDescription() {
    this.setState({description: true});
    this.forceUpdate();
  }
  closeDescription() {
    this.setState({description: false});
    this.forceUpdate();
  }
  validerReservation() {

  }
  closeReservation() {

  }
  render() {
    let cardImgContent = null;
    if (!this.state.description) {
      cardImgContent =  <img className="card-img-top" src={this.props.thumbUrl} alt="Caméra" key={"img"+this.props.id_materiel} />;

    }
    else {
      cardImgContent =  <div className="card-block" key={"desc"+this.props.id_materiel} >
                            <p className="card-text">{this.props.description}</p>
                        </div>;
    }

    let emprunteOuReserve = !this.props.disponible;
    let index = 0;
    let emprunte = emprunteOuReserve && !this.props.historique.length === 0 && this.props.historique.reverse()[0].valide;
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
      <div className="card" onMouseEnter={this.openDescription} onMouseLeave={this.closeDescription} data-id={this.props._id}>
        <ReactCSSTransitionReplace transitionName="cross-fade" transitionLeave={false} transitionEnterTimeout={100}>
          {cardImgContent}
        </ReactCSSTransitionReplace>
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
  showHistorique: true
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
                  caution: '400€'
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
                  ]
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
                    }
                  ]
                }
              ]
};


export default MatosList;
