import React from 'react';
import {render} from 'react-dom';
import moment from 'moment';
import Request from 'superagent';
import Error from './error.jsx';
import CommentList from './comment.jsx';
import CustomLink from './custom-link.jsx';
import Plyr from 'plyr';

moment.locale('fr');

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.deleteVideoConfirm = this.deleteVideoConfirm.bind(this);
    this.populate = this.populate.bind(this);

    this.state = props;

    if (typeof props.route !== 'undefined') this.populate(props.route);
  }

  componentWillReceiveProps(props) {
    this.populate(props.route);
  }

  populate(route) {
    Request.get(route).end((err, data) => {
      if (err) return this.setState({bogus: true});
      data = data.body;
      this.setState(data);
    });
  }

  deleteVideoConfirm() {
    if (confirm('Voulez vous vraiment supprimer cette vidéo ?')) {
      Request.delete('/ajax/video/' + this.props._id).end((err) => {
        if (err) return alert('Une erreur est survenue.');
        window.history.back();
      });
    }
  }

  componentDidMount() {
    Plyr.setup(this.refs.plyr_attachment, {iconUrl: '/defaults/plyr.svg'});
    require('~/node_modules/plyr/src/scss/plyr.scss');
  }

  render() {
    if (this.state.bogus) return <Error err="Vidéo non trouvée !" />;

    let thumbUrl = '/videos/' + this.props._id + '.png';
    let videoUrl = '/videos/' + this.props._id + '.mp4';
    let modifyUrl = '/mediapiston/update/' + this.props._id;

    let videoControls = null;
    if (this.state.isAdmin)
      videoControls = (<div className="videoControls">
        <CustomLink root={this.props.root} className="mdl-button mdl-js-button mdl-button--raised" href={modifyUrl}>
          <i className="fa fa-pencil" aria-hidden="true"/>
        </CustomLink>
        <button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.deleteVideoConfirm}>
          <i className="fa fa-trash-o" aria-hidden="true"/>
        </button>
      </div>);


    return (
      <div id="videoContent">
        <div className="videoPlayer container">
          <video poster={thumbUrl} src={videoUrl} ref='plyr_attachment' controls="true" className="mdl-shadow--3dp"></video>
          {/* Workaround against Plyr moving the videoControls at the bottom of the page*/}
          <div></div>
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
            <CommentList videoId={this.props._id} />
          </div>
        </div>
      </div>
    );
  }
}
VideoPlayer.defaultProps = {
  _id: 0,
  title: 'Titre',
  uploadDate: "2016-06-26",
  uploader: 'CTN',
  description: 'Vidéo Mediapiston',
  views: 0,
  isAdmin: false,
  comments: []
};

export default VideoPlayer;
