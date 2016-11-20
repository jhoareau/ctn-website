import React from 'react';
import moment from 'moment';
import Request from 'superagent';

class Comment extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let commentControls = null;
    if (this.props.edit)
      commentControls = (<div className="commentControls">
        <a className="mdl-button mdl-js-button mdl-button--raised" href="#">
          <i className="fa fa-pencil" aria-hidden="true"/>
        </a>
        <button className="mdl-button mdl-js-button mdl-button--raised">
          <i className="fa fa-trash-o" aria-hidden="true"/>
        </button>
      </div>);

    moment.locale('fr');

    return (
      <div className="comment mdl-shadow--2dp">
        <span className="commentText">{this.props.text}</span>
        <span className="aboutComment">- {this.props.user}, {moment().from(this.props.creationDate)}</span>
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
  }
  postComment(event) {
    event.preventDefault();
    let commentText = document.getElementById('commentText').value;
    if (commentText === "") return;

    if (this.props.update)
    Request.post('/ajax/video/' + this.props.videoId + '/comments/add')
      .send(uploadData)
      .end((err) => {
        if (err) return console.log(err);
        window.location.reload()
      });
    else
      Request.put('/ajax/video/' + this.props.videoId + '/comments/add')
      .send({commentText: commentText})
      .end((err) => {
        if (err) return console.log(err);
        window.location.reload()
      });

  }
  render() {
    return (
      <div className="commentBox">
        <form className="mdl-shadow--2dp" onSubmit={this.postComment}>
          <h6 className="mdl-typography--title formTitle">Poste un commentaire</h6>
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <label htmlFor="commentText" className="mdl-textfield__label">Commentaire plein d'amour ou de haine</label>
            <textarea id="commentText" name="commentText" className="mdl-textfield__input" defaultValue={this.props.update ? this.props.commentText : ''} />
          </fieldset>
          <fieldset className="form-group form-submit">
            <button type="submit" className="mdl-button mdl-js-button mdl-button--raised">{this.props.update ? 'Editer' : 'Poster'}</button>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default class CommentList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.commentList.length > 0)
      return (
        <div className="commentList">
          <span className="commentsTitle">Commentaires</span>
          <CommentBox videoId={this.props.videoId} />
            {this.props.commentList.map((commentObject) => {
              return <Comment {...commentObject} key={commentObject._id} />
            })}
        </div>
      );
    else
      return (
        <div className="commentList">
          <span className="commentsTitle">Cette vidéo n'a pas déchaîné les foules... A toi d'y ajouter ton commentaire!</span>
          <CommentBox videoId={this.props.videoId} />
        </div>
      );
  }
}
CommentList.defaultProps = {
  videoId: 0,
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