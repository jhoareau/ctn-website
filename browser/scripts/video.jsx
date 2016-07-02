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
Video.defaultProps = {
  thumbUrl : '/defaults/no_video.png',
  title: 'Titre',
  uploadDate: "26/06/2016",
  uploader: 'CTN',
  description: 'Vidéo Mediapiston',
  url: '/mediapiston/watch/0'
};

class VideoList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="videoList">
        {this.props.videoList.map((videoObject) => {
          return <Video {...videoObject} key={videoObject.url} />
        })}
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
                url: '/mediapiston/watch/0'
              },
              {
                thumbUrl : '/defaults/no_video.png',
                title: 'Titre 2',
                uploadDate: "27/06/2016",
                uploader: 'CTN',
                description: 'Vidéo 2 Mediapiston',
                url: '/mediapiston/watch/1'
              },
              {
                thumbUrl : '/defaults/no_video.png',
                title: 'Titre 3',
                uploadDate: "27/06/2016",
                uploader: 'CTN',
                description: 'Vidéo 3 Mediapiston',
                url: '/mediapiston/watch/2'
              }
            ]
};


export default VideoList;
