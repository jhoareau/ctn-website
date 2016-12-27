import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Request from 'superagent';
import * as MaterialComponentHandler from 'exports?componentHandler&MaterialRipple!material-design-lite/material'; // Google material-design-lite V1 workaround

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.deleteComment = this.deleteComment.bind(this);
    this.editComment = this.editComment.bind(this);
  }

  deleteComment() {
    if (confirm('Voulez vous vraiment supprimer ce commentaire ?')) {
      Request.delete('/ajax/video/comments/' + this.props._id + '/delete').end((err) => {
        if (err) return console.log(err);
        this.props.triggerReload();
      });
    }
  }

  editComment() {
    this.props.editComment(this.props._id, this.props.text);
  }

  render() {
    let commentControls = null;
    if (this.props.edit)
      commentControls = (<div className="commentControls">
        <a className="mdl-button mdl-js-button mdl-button--raised" onClick={this.editComment}>
          <i className="fa fa-pencil" aria-hidden="true"/>
        </a>
        <button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.deleteComment}>
          <i className="fa fa-trash-o" aria-hidden="true"/>
        </button>
      </div>);

    moment.locale('fr');

    return (
      <div className="comment mdl-shadow--2dp">
        <span className="commentText">{this.props.text}</span>
        <span className="aboutComment">- {this.props.user}, {moment().to(this.props.creationDate)}</span>
        {commentControls}
      </div>
    );
  }
}
Comment.defaultProps = {
  _id: null,
  comment: "CTN c'est un club ou une asso ?"
};

class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    this.postComment = this.postComment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {commentText: props.commentText};
  }
  handleChange(event) {
    this.setState({commentText: event.target.value});
  }
  postComment(event) {
    event.preventDefault();
    if (this.state.commentText == "") return;

    if (!this.props.commentText)
      Request.put('/ajax/video/' + this.props.videoId + '/comments/add')
      .send({commentText: this.state.commentText})
      .end((err) => {
        if (err) return console.log(err);
        this.props.triggerReload();
        this.setState({commentText: ''});

      });
    else
      Request.post('/ajax/video/comments/' + this.props.commentId + '/update')
      .send({commentText: this.state.commentText})
      .end((err) => {
        if (err) return console.log(err);
        this.props.triggerReload();
        this.setState({commentText: ''});
      });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.commentText) {
      this.refs.materialFieldSet.classList.add("is-dirty");
      this.setState({commentText: nextProps.commentText});
    }
    else {
      this.refs.materialFieldSet.classList.remove("is-dirty");
    }
  }
  render() {
    return (
      <div className="commentBox">
        <form ref="commentForm" className="mdl-shadow--2dp" onSubmit={this.postComment}>
          <h6 className="mdl-typography--title formTitle">Poste un commentaire</h6>
          <fieldset ref="materialFieldSet" className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <label htmlFor="commentText" className="mdl-textfield__label">Commentaire plein d'amour ou de haine</label>
            <textarea id="commentText" name="commentText" className="mdl-textfield__input" value={this.state.commentText} onChange={this.handleChange} />
          </fieldset>
          <fieldset className="form-group form-submit">
            <button type="submit" className="mdl-button mdl-js-button mdl-button--raised">{this.props.commentText ? 'Editer' : 'Poster'}</button>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
    this.reloadCommentsState = this.reloadCommentsState.bind(this);
    this.pushBoxText = this.pushBoxText.bind(this);

    this.reloadCommentsState();
  }

  componentWillReceiveProps() {
    this.reloadCommentsState();
  }

  reloadCommentsState() {
    Request.get('/ajax/video/' + this.props.videoId + '/comments').end((err, data_comments) => {
      data_comments = data_comments.body;
      this.setState({commentList: data_comments, commentText: '', commentId: ''});
    });
  }
  pushBoxText(commentId, commentText) {
    this.setState({commentText: commentText, commentId: commentId});
    ReactDOM.findDOMNode(this.refs.commentBox).scrollIntoView();
  }
  componentDidMount() {
    MaterialComponentHandler.componentHandler.upgradeDom();
  }
  render() {
    if (this.state.commentList.length > 0)
      return (
        <div className="commentList">
          <span className="commentsTitle">Commentaires</span>
          <CommentBox ref="commentBox" videoId={this.props.videoId} triggerReload={this.reloadCommentsState} commentId={this.state.commentId} commentText={this.state.commentText} />
            {this.state.commentList.map((commentObject) => {
              return <Comment {...commentObject} key={commentObject._id} _id={commentObject._id} triggerReload={this.reloadCommentsState} editComment={this.pushBoxText} />
            })}
        </div>
      );
    else
      return (
        <div className="commentList">
          <span className="commentsTitle">Cette vidéo n'a pas déchaîné les foules... A toi d'y ajouter ton commentaire!</span>
          <CommentBox ref="commentBox" videoId={this.props.videoId} triggerReload={this.reloadCommentsState} commentId={this.state.commentId} commentText={this.state.commentText} />
        </div>
      );
  }
}
CommentList.defaultProps = {
  videoId: 0,
  commentText: "",
  commentId: "",
  commentList: [
              {
                _id: 0,
                text: "CTN c'est un club ou une asso ?",
                user: "Julien Hoareau",
                date: new Date(),
                edit: true
              },
              {
                _id: 1,
                text: "Lel.",
                user: "Antonio de Jesus Montez",
                date: new Date()
              }
            ]
};