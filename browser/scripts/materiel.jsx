import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
    this.setState({description: true, height: document.getElementsByClassName('card-img-top')[0].clientHeight });
  }
  closeDescription() {
    this.setState({description: false});
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
      let style = {
        height: this.state.height
      }
      cardImgContent =  <div className="card-block" key={"desc"+this.props.id_materiel} style={style} >
                            <p className="card-text">{this.props.description}</p>
                        </div>;
    }

    return (
      <div className="card"  onMouseEnter={this.openDescription} onMouseLeave={this.closeDescription}>
        <ReactCSSTransitionGroup transitionName="description">
          {cardImgContent}
        </ReactCSSTransitionGroup>
        <div className="card-block">
          <h4 className="card-title">{this.props.name}</h4>
          <p className="card-text">Caution : {this.props.caution}</p>
          {/* Empruntée dans le présent ou dans le passé */}
          {!this.props.disponible && this.props.responsable_emprunt ? <p className="card-text">Empruntée par {this.props.emprunteur} le {this.props.date_emprunt}
                                                             <br/>Responsable : {this.props.responsable_emprunt}</p> : null}
          {/* Empruntée dans le présent */}
          {!this.props.disponible && this.props.responsable_emprunt && !this.props.rendu_le ? <button className="btn btn-danger" data-id={this.props.id_materiel} onClick={this.closeReservation}>Rendre matériel</button> : null}
          {/* Réservée */}
          {!this.props.disponible && !this.props.responsable_emprunt ? <p className="card-text">Réservée par {this.props.emprunteur} le {this.props.date_emprunt}</p> : null}
          {!this.props.disponible && !this.props.responsable_emprunt ? <button className="btn btn-success" data-id={this.props.id_materiel} onClick={this.validerReservation}>Valider réservation</button> : null}
          {!this.props.disponible && !this.props.responsable_emprunt ? <button className="btn btn-danger" data-id={this.props.id_materiel} onClick={this.closeReservation}>Annuler réservation</button> : null}
          {/* Emprunté dans le passé */}
          {this.props.rendu_le ? <p className="card-text">Rendu le {this.props.rendu_le} avec {this.props.responsable_rendu}</p> : null}
          {/* Ni emprunté ni réservé */}
          {this.props.disponible && !this.props.rendu_le ? <p className="card-text materielDispo">Disponible !</p> : null}
          {this.props.disponible && !this.props.rendu_le ? <button className="btn btn-primary" data-id={this.props.id_materiel} onClick={this.openReservation}>Réserver</button> : null}
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
  emprunteur: null,
  date_emprunt: null,
  responsable_emprunt: null,
  id_materiel: 0,
  id_histo: null,
  rendu_le: null,
  responsable_rendu: null
};

class MatosList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="matosList">
        {this.props.matosList.map((cameraObject) => {
          return <Camera {...cameraObject} key={cameraObject.id_materiel + cameraObject.id_histo} />
        })}
      </div>
    );
  }
}
MatosList.defaultProps = {
  matosList: [
                {
                  thumbUrl : '/defaults/gopro_4.jpg',
                  name: 'Clara - GoPro Hero 4',
                  description: 'Caméra CTN',
                  disponible: true,
                  caution: '400€',
                  id_histo: null,
                  id_materiel: 1
                },
                {
                  thumbUrl : '/defaults/gopro_4.jpg',
                  name: 'GoPro Hero 3',
                  description: 'Caméra CTN moins bien',
                  disponible: false,
                  emprunteur: 'Antonio de Jesus Montez',
                  date_emprunt: '27/06/2016',
                  id_histo: null,
                  id_materiel: 2
                },
                {
                  thumbUrl : '/defaults/gopro_4.jpg',
                  name: 'GoPro Hero 3',
                  description: 'Caméra CTN moins bien',
                  disponible: false,
                  emprunteur: 'Antonio de Jesus Montez',
                  date_emprunt: '27/06/2016',
                  responsable_emprunt: 'Akelo',
                  id_histo: 'ghi',
                  id_materiel: 3
                },
                {
                  thumbUrl : '/defaults/gopro_4.jpg',
                  name: 'GoPro Hero 2',
                  description: 'Caméra CTN pas bien',
                  caution: '250€',
                  disponible: false,
                  emprunteur: 'Antonio de Jesus Montez',
                  date_emprunt: '27/06/2016',
                  responsable_emprunt: 'Akelo',
                  rendu_le: '28/06/2016',
                  responsable_rendu: 'Khynder',
                  id_histo: 'jkl',
                  id_materiel: 4
                }
              ]
};


export default MatosList;
