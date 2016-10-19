let mongoose = require('mongoose');

let newsSchema = new mongoose.Schema({
  text: String,
  writer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

let News = mongoose.model('News', newsSchema);
exports.model = News;

exports.create = (infos, callback) => {
    let schema = {
      text: infos.text,
      writer: infos.user
    }
    let newComment = new Comment(schema);
    newComment.save((err, result) => {
      if (err) throw new Error("Erreur lors de la création de la nouvelle news.");
      callback(result);
    })
}

exports.return = (id, callback) => {
  Comment.findById(id, (err, news) => {
    if (err) throw new Error('Erreur lors de la récupération de la nouvelle news.');
    callback(news);
  });
}

exports.updateText = (id, update, callback) => {
  Comment.findByIdAndUpdate(id, {$set: update}, (err, result) => {
    if (err) throw new Error('Erreur lors de la mise à jour de la nouvelle news.');
    callback(result);
  });
}

exports.delete = (id, callback) => {
  Comment.findByIdAndRemove(id, (err, result) => {
    if (err) throw new Error('Erreur lors de la suppression de la nouvelle news.');
    callback(result);
  });
}
