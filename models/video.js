let mongoose = require('mongoose');

let videoSchema = new mongoose.Schema({
  title: String,
  uploadDate: Date,
  uploader: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  description: String,
  views: Number
});

let Video = mongoose.model('Video', videoSchema);
exports.model = Video;

exports.returnVideo = (id, callback) => {
  if (id === null) {
    Video.find({}).populate('uploader').exec((err, result) => {
      if (err) callback([], new Error('Erreur lors de la récupération de la liste des vidéos.'));
      var filteredResults = result.map(obj => {
        var filteredObj = obj.toJSON();
        filteredObj.uploader = obj.uploader.surname;
        return filteredObj;
      });
      callback(filteredResults);
    });
  }
  else {
    // On incrémente le nombre de vues à chaque fetch quasi-unique
    Video.findByIdAndUpdate(id, {$inc: {views: 1}}).populate('uploader').exec((err, result) => {
      if (err) callback({}, new Error('Erreur lors de la récupération de la vidéo. ID = ' + id));
      var filteredResult = result.toJSON();

      if (typeof filteredResult.uploader !== 'undefined') filteredResult.uploader = result.uploader.surname;
      callback(filteredResult);
    });
  }
}

exports.returnVideoList = exports.returnVideo.bind(this, null);

exports.returnRelatedVideos = (id, callback) => {
  Video.findOne({_id: id}, (err, result) => {
    if (err) callback([], new Error('Erreur lors de la récupération de la vidéo. ID = ' + id));
    title = result.title;
    Video.find({}, (err, allVideos) => {
      if (err) throw new Error('Erreur lors de la récupération de la liste des vidéos liées. ID = ' + id);
      relatedVideos = require('fuzzy').filter(title, allVideos, {extract: video => video.title}).map(e => e.original);
      callback(relatedVideos);
    });
  });
}

exports.generateVideoID = (callback) => {
  let newVideo = new Video({});
  newVideo.save((err, importedObject) => {
    if (err) callback(null, new Error("Erreur lors de l'ajout de la nouvelle vidéo."));
    callback(importedObject._id);
  });
};

exports.updateVideo = (id, data, callback) => {
  Video.findById(id, (err, video) => {
    if (err) callback([], new Error('Erreur lors de la récupération de la vidéo à mettre à jour. ID = ' + id));
    if (video === null) return callback({ok: false});

    video.title = data.title;
    video.description = data.description;
    if (data.date) video.date = data.date;
    if (data.session) video.uploader = data.session._id;

    video.save((err) => {
      if (err) callback({ok: false}, new Error('Erreur lors de la mise à jour de la vidéo. ID = ' + id));
      callback({ok: true});
    });
  });
};

exports.deleteVideo = (id, callback) => {
  Video.findByIdAndRemove(id, err => {
    if (err) callback({ok: false}, new Error('Erreur lors de la suppression de la vidéo. ID = ' + id));
    callback({ok: true});
  });
};
