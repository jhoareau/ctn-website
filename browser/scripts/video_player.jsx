import React from 'react';
import {render} from 'react-dom';
import moment from 'moment';
import Request from 'superagent';
import CommentList from './comment.jsx';
import Plyr from 'plyr';

moment.locale('fr');

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.deleteVideoConfirm = this.deleteVideoConfirm.bind(this);
    this.populate = this.populate.bind(this);
    this.populateComments = this.populateComments.bind(this);

    this.state = props;

    if (typeof props.route !== 'undefined') this.populate(props.route);
    this.populateComments();
  }

  populate(route) {
    Request.get(route).end((err, data) => {
      data = data.body;
      this.setState(data);
    });
  }

  populateComments() {
    Request.get('/ajax/video/' + this.props._id + '/comments').end((err, data_comments) => {
      data_comments = data_comments.body;
      this.setState({comments: data_comments});
    });
  }

  deleteVideoConfirm() {
    if (confirm('Voulez vous vraiment supprimer cette vidéo ?')) {
      Request.delete('/ajax/video/' + this.props._id + '/delete').end((err) => {
        if (err) return alert('Une erreur est survenue.');
        window.history.back();
      });
    }
  }

  componentDidMount() {
    require('./videoplayer_setup')(Plyr);
    require('~/node_modules/plyr/src/scss/plyr.scss');
  }

  render() {
    let thumbUrl = '/videos/' + this.props._id + '.png';
    let videoUrl = '/videos/' + this.props._id + '.mp4';
    let modifyUrl = '/mediapiston/update/' + this.props._id;

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
      <div id="videoContent">
        <div className="videoPlayer container">
          <video poster={thumbUrl} src={videoUrl} controls="true" className="mdl-shadow--3dp" />
          {videoControls}
          <div className="videoDetails mdl-shadow--3dp">
            <div className="row">
              <div className="col-md-8">
                <h3>{this.state.title}</h3>
              </div>
              <div className="col-md-4">
                <p>Mis en ligne le {moment(this.state.uploadDate).format("D MMMM YYYY")} par {this.state.uploader}<br/><small>{this.state.views} {this.state.views === 1 ? "vue" : "vues"}</small></p>
              </div>
            </div>
            <div className="videoDescription">
              <p>{this.state.description}</p>
            </div>
          </div>
          <div className="commentsBox" id="comments">
            <CommentList commentList={this.state.comments} videoId={this.props._id} />
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
  isAdmin: false,
  comments: []
};

export default VideoPlayer;
