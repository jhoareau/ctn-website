let mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
  text: String,
  votes: {type: Number, default: 0},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  video: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'}
});

let Comment = mongoose.model('Comment', commentSchema);
exports.model = Comment;

exports.create = (infos, callback) => {
    let schema = {
      text: infos.text,
      user: infos.user
    }
    let newComment = new Comment(schema);
    newComment.save((err, result) => {
      if (err) throw new Error("Erreur lors de la création du nouveau commentaire.");
      callback(result);
    })
}

exports.return = (id, callback) => {
  Comment.findById(id, (err, comment) => {
    if (err) throw new Error('Erreur lors de la récupération du commentaire.');
    callback(comment);
  });
}

exports.updateVotes = (id, up, callback) => {
  Comment.findByIdAndUpdate(id, {$inc: {votes: up ? 1 : -1}}, (err, result) => {
    if (err) throw new Error('Erreur lors de la mise à jour du nombre de votes du commentaire.');
    callback(result);
  });
}

exports.updateText = (id, update, callback) => {
  Comment.findByIdAndUpdate(id, {$set: update}, (err, result) => {
    if (err) throw new Error('Erreur lors de la mise à jour du commentaire.');
    callback(result);
  });
}

exports.getByVideo = (videoId, callback) => {
  Comment.find({video: videoId}, (err, comments) => {
    if (err) throw new Error('Erreur lors de la récupération des commentaires pour la vidéo ' + videoId + '.');
    callback(comments);
  })
}

exports.delete = (id, callback) => {
  Comment.findByIdAndRemove(id, (err, result) => {
    if (err) throw new Error('Erreur lors de la suppression du commentaire.');
    callback(result);
  });
}
