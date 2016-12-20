import React from 'react';
import {render} from 'react-dom';
import moment from 'moment';
import Request from 'superagent';
import CommentList from './comment.jsx';

moment.locale('fr');

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.deleteVideoConfirm = this.deleteVideoConfirm.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.populateComments();
  }

  populateComments() {
    Request.get('/ajax/video/' + this.props._id + '/comments').end((err, data_comments) => {
      data_comments = data_comments.body;
      render(<CommentList commentList={data_comments} videoId={this.props._id} />, document.getElementById('comments'));
    });
  }

  deleteVideoConfirm() {
    if (confirm('Voulez vous vraiment supprimer cette vidéo ?')) {
      Request.delete('/ajax/video/' + this.props._id + '/delete').end((err) => {
        if (err) return alert('Une erreur est survenue.');
        window.location = '/mediapiston';
      });
    }
  }
  render() {
    let thumbUrl = '/videos/' + this.props._id + '.png';
    let videoUrl = '/videos/' + this.props._id + '.mp4';
    let modifyUrl = '/mediapiston/update/' + this.props._id;

    let commentsData = this.props.comments;

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
        <video poster={thumbUrl} src={videoUrl} controls="true" className="mdl-shadow--3dp" />
        {videoControls}
        <div className="videoDetails mdl-shadow--3dp">
          <div className="row">
            <div className="col-md-8">
              <h3>{this.props.title}</h3>
            </div>
            <div className="col-md-4">
              <p>Mis en ligne le {moment(this.props.uploadDate).format("D MMMM YYYY")} par {this.props.uploader}<br/><small>{this.props.views} {this.props.views === 1 ? "vue" : "vues"}</small></p>
            </div>
          </div>
          <div className="videoDescription">
            <p>{this.props.description}</p>
          </div>
        </div>
        <div className="commentsBox" id="comments">
          <CommentList videoId={this.props._id} />
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
