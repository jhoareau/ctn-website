import React from 'react';
import * as moment from 'moment';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="videoPlayer container">
        <div className="row">
          <video poster={this.props.thumbUrl} src={this.props.videoUrl} controls="true" />
        </div>
        <div className="row videoDetails">
          <div className="col-md-8">
            <h3>{this.props.title}</h3>
          </div>
          <div className="col-md-4">
            <p>Mis en ligne le {this.props.uploadDate} par {this.props.uploader}<br/><small>{this.props.views} vues</small></p>
          </div>
        </div>
        <div className="row videoDescription">
          <p>{this.props.description}</p>
        </div>

      </div>
    );
  }
}
VideoPlayer.defaultProps = {
  thumbUrl : '/defaults/no_video.png',
  videoUrl : '/defaults/no_video.mp4',
  title: 'Titre',
  uploadDate: "26/06/2016",
  uploader: 'CTN',
  description: 'Vidéo Mediapiston',
  views: 0
};

export default VideoPlayer;
