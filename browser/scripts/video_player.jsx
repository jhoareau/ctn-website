import React from 'react';
import * as moment from 'moment';
import $ from 'jquery';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.deleteVideoConfirm = this.deleteVideoConfirm.bind(this);
  }

  deleteVideoConfirm() {
    if (confirm('Voulez vous vraiment supprimer cette vidéo ?')) {
      $.ajax({
        url: '/ajax/video/' + this.props._id + '/delete',
        method: 'DELETE',
        success: () => {
          window.location = '/mediapiston';
        },
        error: () => {
          alert('Une erreur est survenue.');
        }
      });
    }
  }
  render() {
    let thumbUrl = '/videos/' + this.props._id + '.png';
    let videoUrl = '/videos/' + this.props._id + '.mp4';
    let modifyUrl = '/videos/' + this.props._id;

    let videoControls = null;
    if (this.props.isAdmin)
      videoControls = (<div className="videoControls">
        <a className="mdl-button mdl-js-button mdl-button--raised" href={modifyUrl}>
          <i className="fa fa-pencil" aria-hidden="true"/>
        </a>
        <button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.deleteVideoConfirm}>
          <i className="fa fa-trash-o" aria-hidden="true"/>
        </button>
      </div>);

    return (
      <div className="videoPlayer container">
        <video poster={thumbUrl} src={videoUrl} controls="true" />
        {videoControls}
        <div className="videoDetails mdl-shadow--2dp">
          <div className="row">
            <div className="col-md-8">
              <h3>{this.props.title}</h3>
            </div>
            <div className="col-md-4">
              <p>Mis en ligne le {this.props.uploadDate} par {this.props.uploader}<br/><small>{this.props.views} vues</small></p>
            </div>
          </div>
          <div className="videoDescription">
            <p>{this.props.description}</p>
          </div>
        </div>
      </div>
    );
  }
}
VideoPlayer.defaultProps = {
  _id: 0,
  title: 'Titre',
  uploadDate: "26/06/2016",
  uploader: 'CTN',
  description: 'Vidéo Mediapiston',
  views: 0,
  isAdmin: false
};

export default VideoPlayer;
