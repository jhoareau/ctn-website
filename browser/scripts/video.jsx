import React from 'react';
import * as moment from 'moment';

class Video extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let description = this.props.description;
    if (description.length > 150) description = description.substring(0, 147) + "...";
    return (
      <div className="mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title" style={{backgroundImage: 'url(' + this.props.thumbUrl + ')'}}>
          <a href={'/mediapiston/watch/' + this.props._id}><h2 className="mdl-card__title-text">{this.props.title}</h2></a>
        </div>
        <div className="mdl-card__supporting-text">
          {description}<br/>
        <small className="text-muted">Mis en ligne le {this.props.uploadDate} par {this.props.uploader}</small>
        </div>
      </div>
    );
  }
}
Video.defaultProps = {
  thumbUrl : '/defaults/no_video.png',
  title: 'Titre',
  uploadDate: "26/06/2016",
  uploader: 'CTN',
  description: 'Vidéo Mediapiston',
  url: '/mediapiston/watch/null',
  _id: null
};

class VideoList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.videoList.length > 0)
      return (
        <div className="videoList">
          {this.props.videoList.map((videoObject) => {
            return <Video {...videoObject} key={videoObject._id} />
          })}
        </div>
      );
    else
      return (
        <div className="alert alert-warning" role="alert">
          Il n'y a pas de vidéos correspondant à ces critères...
        </div>
      );
  }
}
VideoList.defaultProps = {
  videoList: [
              {
                thumbUrl : '/defaults/no_video.png',
                title: 'Titre',
                uploadDate: "26/06/2016",
                uploader: 'CTN',
                description: 'Vidéo Mediapiston',
                _id: 0
              },
              {
                thumbUrl : '/defaults/no_video.png',
                title: 'Titre 2',
                uploadDate: "27/06/2016",
                uploader: 'CTN',
                description: 'Vidéo 2 Mediapiston',
                _id: 1
              },
              {
                thumbUrl : '/defaults/no_video.png',
                title: 'Titre 3',
                uploadDate: "27/06/2016",
                uploader: 'CTN',
                description: 'Vidéo 3 Mediapiston',
                _id: 2
              }
            ]
};


export default VideoList;
