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
    Video.find({}, (err, result) => {
      if (err) throw new Error('Erreur lors de la récupération de la liste des vidéos.');
      callback(result);
    });
  }
  else {
    // On incrémente le nombre de vues à chaque fetch quasi-unique
    Video.findByIdAndUpdate(id, {$inc: {views: 1}}, (err, result) => {
      if (err) throw new Error('Erreur lors de la récupération de la vidéo.');
      callback(result);
    });
  }
}

exports.returnVideoList = exports.returnVideo.bind(this, null);

exports.returnRelatedVideos = (id, callback) => {
  Video.findOne({_id: id}, (err, result) => {
    if (err) throw new Error('Erreur lors de la récupération de la vidéo.');
    title = result.title;
    Video.find({}, (err, allVideos) => {
      if (err) throw new Error('Erreur lors de la récupération de la liste des vidéos.');
      relatedVideos = require('fuzzy').filter(title, allVideos, {extract: video => video.title}).map(e => e.original);
      console.log(relatedVideos);
      callback(relatedVideos);
    });
  });
}

exports.generateVideoID = (callback) => {
  let schema = {};

  let newVideo = new Video(schema);
  newVideo.save((err, importedObject) => {
    if (err) throw new Error("Erreur lors de l'ajout de la nouvelle vidéo.");
    callback(importedObject._id);
  });
};

exports.updateVideo = (id, data, callback) => {
  Video.findById(id, (err, video) => {
    if (err) throw new Error('Erreur lors de la récupération de la vidéo à mettre à jour.');
    if (video === null) return callback({ok: false});

    video.title = data.title;
    video.description = data.description;
    if (data.date) video.date = data.date;
    if (data.session) video.uploader = data.session._id;

    video.save((err) => {
      if (err) throw new Error('Erreur lors de la mise à jour de la vidéo.');
      callback({ok: true});
    });
  });
};

exports.deleteVideo = (id, callback) => {
  Video.findByIdAndRemove(id, err => {
    if (err) throw new Error('Erreur lors de la suppression de la vidéo.');
    callback({ok: true});
  });
};
