import React from 'react';

class Camera extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="card">
        <img className="card-img-top" src={this.props.thumbUrl} alt="Caméra" />
        <div className="card-block">
          <h4 className="card-title">{this.props.name}</h4>
          {!this.props.disponible ? <p className="card-text">Empruntée par {this.props.emprunteur} le {this.props.date_emprunt}
                                                             <br/>Responsable : {this.props.responsable_emprunt}</p> : null}
          {this.props.disponible ? <a href="#" className="btn btn-primary">Réserver</a> : null}
        </div>
      </div>
    );
  }
}
Camera.defaultProps = {
  thumbUrl : require('~/public/assets/gopro_4.jpg'),
  name: 'Clara - GoPro Hero 4',
  disponible: true,
  emprunteur: null,
  date_emprunt: null,
  responsable_emprunt: null
};

class CameraList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="cameraList">
        {this.props.cameraList.map((cameraObject) => {
          return <Camera {...cameraObject} />
        })}
      </div>
    );
  }
}
CameraList.defaultProps = {
  cameraList: [
                {
                  thumbUrl : require('~/public/assets/gopro_4.jpg'),
                  name: 'Clara - GoPro Hero 4',
                  disponible: true,
                  emprunteur: null,
                  date_emprunt: null,
                  responsable_emprunt: null
                },
                {
                  thumbUrl : require('~/public/assets/gopro_4.jpg'),
                  name: 'GoPro Hero 3',
                  disponible: false,
                  emprunteur: 'Antonio de Jesus Montez',
                  date_emprunt: '27/06/2016',
                  responsable_emprunt: 'Akelo'
                },
                {
                  thumbUrl : require('~/public/assets/gopro_4.jpg'),
                  name: 'GoPro Hero 3',
                  disponible: false,
                  emprunteur: 'Antonio de Jesus Montez',
                  date_emprunt: '27/06/2016',
                  responsable_emprunt: 'Akelo'
                }
              ]
};


export default CameraList;
