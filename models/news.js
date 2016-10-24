let mongoose = require('mongoose');

let newsSchema = new mongoose.Schema({
  text: String,
  writer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});
// + titre, sous-titre, image

let News = mongoose.model('News', newsSchema);
exports.model = News;

exports.createNews = (infos, callback) => {
    let schema = {
      text: infos.text,
      writer: infos.session._id
    }
    let newNews = new News(schema);
    newNews.save((err, result) => {
      if (err) return callback(null, new Error("Erreur lors de la création de la nouvelle news."));
      callback(result._id);
    })
}

exports.returnNews = (id, callback) => {
  News.find({_id: id}).populate('writer').exec((err, result) => {
    if (err) return callback(null, new Error('Erreur lors de la récupération de la news. ID = ' + id));
    if (result === null || typeof result === 'undefined') return callback(null);

    let filteredResult = result.toJSON();

    if (typeof filteredResult.user !== 'undefined') filteredResult.user = result.user.surname;

    callback(filteredResult);
  });
}
// return all news est où ??

// faire un update global pour toutes les data d'un coup, cf updateVideo
/* exports.updateVideo = (id, data, callback) => {
  Video.findById(id, (err, video) => {
    if (err) return callback({ok: false}, new Error('Erreur lors de la récupération de la vidéo à mettre à jour. ID = ' + id));
    if (video === null || typeof video === 'undefined') return callback({ok: false});

    video.title = data.title;
    video.description = data.description;
    if (data.date) video.date = data.date;
    if (data.session) video.uploader = data.session._id;

    video.save((err2) => {
      if (err2) return callback({ok: false}, new Error('Erreur lors de la mise à jour de la vidéo. ID = ' + id));

      callback({ok: true});
    });
  });
}; */
exports.updateText = (id, data, callback) => {
  News.findByIdAndUpdate(id, (err, result) => {
    if (err) throw new Error('Erreur lors de la mise à jour de la news.');
    callback(result);
  });
}

exports.deleteNews = (id, callback) => {
  News.findByIdAndRemove(id, (err, result) => {
    if (err) return callback({ok: false}, new Error('Erreur lors de la suppression de la news. ID = ' + id));
    callback({ok: true});
  });
}
