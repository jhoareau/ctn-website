let mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
  text: String,
  votes: {type: Number, default: 0},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  video: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'}
});

let Comment = mongoose.model('Comment', commentSchema);
exports.model = Comment;

exports.createComment = (data, callback) => {
    let schema = {
      text: data.text,
      user: data.user
    };
    let newComment = new Comment(schema);
    newComment.save((err, result) => {
      if (err) return callback(null, new Error("Erreur lors de la création du nouveau commentaire."));
      callback(result._id);
    })
}

exports.returnComment = (id, callback) => {
  Comment.findById(id, (err, result) => {
    if (err) return callback(null, new Error('Erreur lors de la récupération du commentaire. ID = ' + id));
    if (result === null || typeof result === 'undefined') return callback(null);

    callback(result);
  });
}

exports.updateVotes = (id, up, callback) => {
  Comment.findByIdAndUpdate(id, {$inc: {votes: up ? 1 : -1}}, (err, result) => {
    if (err) return callback({ok: false}, new Error('Erreur lors de la mise à jour du nombre de votes du commentaire. ID = ' + id));
    if (result === null || typeof result === 'undefined') return callback({ok: false});

    callback({ok: true});
  });
}

exports.updateText = (id, newText, callback) => {
  Comment.findById(id, (err, comment) => {
    if (err) return callback({ok: false}, new Error('Erreur lors de la récupération du commentaire à mettre à jour. ID = ' + id));
    if (result === null || typeof result === 'undefined') return callback({ok: false});

    comment.text = newText;

    comment.save((err2) => {
      if (err2) return callback({ok: false}, new Error('Erreur lors de la mise à jour du commentaire. ID = ' + id));

      callback({ok: true});
    });
  });
}

exports.getByVideo = (videoId, callback) => {
  Comment.find({video: videoId}).populate('user').exec((err, result) => {
    if (err) return callback(null, new Error('Erreur lors de la récupération des commentaires pour la vidéo. ID = ' + videoId));
    if (result === null || typeof result === 'undefined') return callback([]);

    let filteredResults = result.map(obj => {
        let filteredObj = obj.toJSON();
        filteredObj.user = obj.user.surname;
        return filteredObj;
      });
    
    callback(filteredResults);
  })
}

exports.deleteComment = (id, callback) => {
  Comment.findByIdAndRemove(id, err => {
    if (err) return callback({ok: false}, new Error('Erreur lors de la suppression du commentaire. ID = ' + id));
    callback({ok: true});
  });
}
