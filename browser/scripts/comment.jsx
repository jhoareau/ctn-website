import React from 'react';
import moment from 'moment';

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
        <span className="commentText">{this.props.comment}</span>
        <span className="aboutComment">- {this.props.user}, {moment().from(this.props.date)}</span>
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
  }
  render() {
    return (
      <div className="commentBox">
      
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
          <CommentBox />
            {this.props.commentList.map((commentObject) => {
              return <Comment {...commentObject} key={commentObject._id} />
            })}
        </div>
      );
    else
      return (
        <div className="commentList">
          <span className="commentsTitle">Cette vidéo n'a pas déchaîné les foules... A toi d'y ajouter ton commentaire!</span>
          <CommentBox />
        </div>
      );
  }
}
CommentList.defaultProps = {
  commentList: [
              {
                _id: 0,
                comment: "CTN c'est un club ou une asso ?",
                user: "Julien Hoareau",
                date: new Date(),
                edit: true
              },
              {
                _id: 1,
                comment: "Lel.",
                user: "Antonio de Jesus Montez",
                date: new Date()
              }
            ]
};