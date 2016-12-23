import React from 'react';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import Request from 'superagent';
import CustomLink from './custom-link.jsx';

moment.locale('fr');

class Video extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let description = this.props.description;
    let thumbUrl = '/videos/' + this.props._id + '.png';
    let url = '/watch/' + this.props._id;
    if (description.length > 150) description = description.substring(0, 147) + "...";

    return (
      <div className="mdl-card display_card mdl-shadow--2dp">
        <div className="mdl-card__title" style={{backgroundImage: 'url(' + thumbUrl + ')'}}>
          <CustomLink href={url} root={this.props.root || false}><h2 className="mdl-card__title-text">{this.props.title}</h2></CustomLink>
        </div>
        <div className="mdl-card__supporting-text">
          {description}<br/>
        <small className="text-muted">Mis en ligne le {moment(this.props.uploadDate).format("D MMMM YYYY")} par {this.props.uploader}</small>
        </div>
      </div>
    );
  }
}
Video.defaultProps = {
  title: 'Titre',
  uploadDate: "2016-12-22",
  uploader: 'CTN',
  description: 'Vidéo Mediapiston',
  _id: null
};

export class VideoList extends React.Component {
  constructor(props) {
    super(props);
    this.populate = this.populate.bind(this);
    this.state = props;

    if (typeof props.route !== 'undefined') this.populate(props.route);
  }
  populate(route) {
    Request.get(route).end((err, data) => {
      data = data.body;
      this.setState({videoList: data});
    });
  }
  render() {
    if (this.state.videoList.length > 0)
      return (
        <div className="videoList">
          {this.state.videoList.map(videoObject => {
            return <Video {...videoObject} key={videoObject._id} root={this.props.root || ''} />
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
                title: 'Titre',
                uploadDate: "26/06/2016",
                uploader: 'CTN',
                description: 'Vidéo Mediapiston',
                _id: 0
              },
              {
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

class RelatedVideo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let thumbUrl = '/videos/' + this.props._id + '.png';
    let url = '/watch/' + this.props._id;

    return (
      <div className="mdl-card mdl-shadow--2dp" style={{backgroundImage: 'url(' + thumbUrl + ')'}}>
        <div className="mdl-card__title mdl-card--expand"></div>
        <div className="mdl-card__actions">
          <CustomLink href={url} className="relatedVideoLink" root={this.props.root}><h2 className="mdl-card__title-text">{this.props.title}</h2></CustomLink>
        </div>
      </div>
    );
  }
}
RelatedVideo.defaultProps = Video.defaultProps;

export class RelatedVideoList extends React.Component {
  constructor(props) {
    super(props);
      this.populate = this.populate.bind(this);
    this.state = props;

    if (typeof props.route !== 'undefined') this.populate(props.route);
  }

  populate(route) {
    Request.get(route).end((err, data) => {
      data = data.body;
      this.setState({videoList: data});
    });
  }

  render() {
    if (this.state.videoList.length > 0)
      return (
        <div className="relatedVideoList">
          <h4 className="display-1">Vidéos suggérées</h4>
          {this.state.videoList.map((videoObject) => {
            return <RelatedVideo {...videoObject} key={videoObject._id} root={this.props.root} />
          })}
        </div>
      );
    else return (<div className="relatedVideoList">
          <h4 className="display-1">Aucune vidéo suggérée!</h4>
        </div>);
  }
}
RelatedVideoList.defaultProps = VideoList.defaultProps;
