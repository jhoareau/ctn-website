import React from 'react';
import * as moment from 'moment';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="card">
        <a href={this.props.url} className="cardLink"><img className="card-img-top" src={this.props.thumbUrl} alt="Miniature" /></a>
        <div className="card-block">
          <h4 className="card-title">{this.props.title}</h4>
          <p className="card-text">{description}</p>
          <p className="card-text"><small class="text-muted">Mis en ligne le {this.props.uploadDate} par {this.props.uploader}</small></p>
        </div>
      </div>
    );
  }
}
VideoPlayer.defaultProps = {
  thumbUrl : require('~/public/assets/no_video.png'),
  title: 'Titre',
  uploadDate: "26/06/2016",
  uploader: 'CTN',
  description: 'Vidéo Mediapiston',
  views: 0
};

export default VideoPlayer;
