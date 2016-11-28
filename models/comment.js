let mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
  text: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  video: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'},
  creationDate: {type: Date, default: Date.now}
});

let Comment = mongoose.model('Comment', commentSchema);
exports.model = Comment;

exports.create = (data, callback) => {
    let schema = {
      text: data.text,
      user: data.session._id,
      video: data.videoId
    };
    let newComment = new Comment(schema);
    newComment.save((err, result) => {
      if (err) return callback(null, new Error("Erreur lors de la création du nouveau commentaire."));
      callback(result._id);
    })
}

exports.return = (id, callback) => {
  if (id === null) {
    Comment.find({}).sort('-creationDate').populate('user').exec((err, result) => {
      if (err) return callback(null, new Error('Erreur lors de la récupération de la liste des commentaires.'));
      if (result === null || typeof result === 'undefined') return callback(null);

      let filteredResults = result.map(obj => {
        let filteredObj = obj.toJSON();
        if (obj.user) filteredObj.user = obj.user.fullName;
        return filteredObj;
      });
      callback(filteredResults);
    });
  }
  else {
    Comment.find({_id: id}).populate('user').exec((err, result) => {
      if (err) return callback(null, new Error('Erreur lors de la récupération du commentaire. ID = ' + id));
      if (result === null || typeof result === 'undefined') return callback(null);

      let filteredResult = result.toJSON();

      if (typeof filteredResult.user !== 'undefined') filteredResult.user = result.user.fullName;
      callback(filteredResult);
    });
  }
}

exports.returnList = exports.return.bind(this, null);

exports.updateText = (id, newText, callback) => {
  Comment.findById(id, (err, comment) => {
    if (err) return callback({ok: false}, new Error('Erreur lors de la récupération du commentaire à mettre à jour. ID = ' + id));
    if (result === null || typeof result === 'undefined') return callback({ok: false});

    if (newText) comment.text = newText;

    comment.save((err2) => {
      if (err2) return callback({ok: false}, new Error('Erreur lors de la mise à jour du commentaire. ID = ' + id));

      callback({ok: true});
    });
  });
}

exports.getByVideo = (videoId, callback) => {
  Comment.find({video: videoId}).sort('-creationDate').populate('user').exec((err, result) => {
    if (err) return callback(null, new Error('Erreur lors de la récupération des commentaires pour la vidéo. ID = ' + videoId));
    if (result === null || typeof result === 'undefined') return callback([]);

    let filteredResults = result.map(obj => {
        let filteredObj = obj.toJSON();
        filteredObj.user = obj.user.fullName;
        return filteredObj;
      });

    callback(filteredResults);
  })
}

exports.delete = (id, callback) => {
  Comment.findByIdAndRemove(id, err => {
    if (err) return callback({ok: false}, new Error('Erreur lors de la suppression du commentaire. ID = ' + id));
    callback({ok: true});
  });
}
