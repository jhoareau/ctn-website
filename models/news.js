let mongoose = require('mongoose');

let newsSchema = new mongoose.Schema({
  text: String,
  writer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: String
});

let News = mongoose.model('News', newsSchema);
exports.model = News;

exports.create = (infos, callback) => {
  let schema = {
    text: infos.text,
    writer: infos.session._id
  }
  let newNews = new News(schema);
  newNews.save((err, result) => {
    if (err) return callback(null, new Error("Erreur lors de la création de la nouvelle news."));
    callback(result._id);
  });
}

exports.return = (id, callback) => {
  News.find({_id: id}).populate('writer').exec((err, result) => {
    if (err) return callback(null, new Error('Erreur lors de la récupération de la news. ID = ' + id));
    if (result === null || typeof result === 'undefined') return callback(null);

    let filteredResult = result.toJSON();

    if (typeof filteredResult.user !== 'undefined') filteredResult.user = result.user.surname;

    callback(filteredResult);
  });
}

exports.update = (id, update, callback) => {
  News.findByIdAndUpdate(id, {$set: update}, (err, news) => {
    if (err) return callback({ok: false}, new Error('Erreur lors de la récupération de la news à mettre à jour. ID = ' + id));
    if (news === null || typeof news === 'undefined') return callback({ok: false});
    callback(news);
  });
}

exports.delete = (id, callback) => {
  News.findByIdAndRemove(id, (err, result) => {
    if (err) return callback({ok: false}, new Error('Erreur lors de la suppression de la news. ID = ' + id));
    callback({ok: true});
  });
}
