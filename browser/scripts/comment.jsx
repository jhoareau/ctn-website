import React from 'react';
import * as moment from 'moment';

class Comment extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="comment mdl-shadow--2dp">
        <p>{this.props.comment}</p>
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

export class CommentList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.commentList.length > 0)
      return (
        <div className="commentList">
          <CommentBox />
            {this.props.commentList.map((commentObject) => {
              return null
            })}
        </div>
      );
    else
      return (
        <div className="commentList">
          Cette vidéo n'a pas déchaîné les foules... A toi d'y ajouter ton commentaire!
          <CommentBox />
        </div>
      );
  }
}
CommentList.defaultProps = {
  commentList: [
              {
                _id: 0,
                comment: "CTN c'est un club ou une asso ?"
              },
              {
                _id: 1,
                comment: "Lel."
              }
            ]
};