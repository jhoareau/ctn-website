let mongoose = require('mongoose');
let {userSchema: userSchema, videoSchema: videoSchema, matosSchema: matosSchema} = require('./mongoose_schemas');

mongoose.connect('mongodb://localhost/test');

let returnUser = (username, callback) => {
  let User = mongoose.model('User', userSchema);
  User.findOne({username: username}, (err, result) => {
    if (err) throw err;
    if (result == null) {
      let userInstance = new User({username: username, admin: false});
      userInstance.save((err) => {
        if (err) throw new Error("Erreur de création d'utilisateur dans la BDD");
      });
      callback(userInstance);
    }
    callback(result);
  });
}

let returnVideo = (id, callback) => {
  let Video = mongoose.model('Video', videoSchema);
  if (id === null) {
    Video.find({}, (err, result) => {
      if (err) throw new Error('Erreur lors de la récupération de la liste des vidéos.');
      callback(result);
    });
  }
  else {
    Video.findById(id, (err, result) => {
      if (err) throw new Error('Erreur lors de la récupération de la vidéo.');
      callback(result);
    });
  }
}

let addVideo = (data, callback) => {
  let Video = mongoose.model('Video', videoSchema);
  let schema = {
    thumbUrl: data.thumb,
    title: data.title,
    description: data.description,
    date: new Date(),
    uploader: data.session.uploader,
    url: data.videoURL
  };

  let newVideo = new Video(schema);
  newVideo.save((err) => {
    if (err) throw new Error("Erreur lors de l'ajout de la nouvelle vidéo.");
    callback({ok: true});
  });
};

let updateVideo = (id, data, callback) => {
  Video.findById(id, (err, video) => {
    if (err) throw new Error('Erreur lors de la récupération de la vidéo à mettre à jour.');
    if (video === null) return callback({ok: false});
    
    video.thumbUrl = data.thumb;
    video.title = data.title;
    video.description = data.description;
    video.url = data.videoURL;

    video.save((err) => {
      if (err) throw new Error('Erreur lors de la mise à jour de la vidéo.');
      callback({ok: true});
    });
  });
};

let returnListMateriel = (admin, callback) => {
  let Materiel = mongoose.model('Materiel', matosSchema);
  if (admin) {
    Materiel.find({}, (err, result) => {
      if (err) throw new Error('Erreur lors de la récupération de la liste du matériel (admin).');
      callback(result);
    });
  }
  else {
    Materiel.find({disponible: true, extes: true}, (err, result) => {
      if (err) throw new Error('Erreur lors de la récupération de la liste du matériel.');
      callback(result);
    });
  }
};

let addMateriel = (data, callback) => {
  let Materiel = mongoose.model('Materiel', matosSchema);
  let schema = {
    thumbUrl: data.thumb,
    extes: data.extes,
    name: data.name,
    caution: data.caution,
    disponible: true,
    historique: []
  };

  let newMateriel = new Materiel(schema);
  newMateriel.save((err) => {
    if (err) throw new Error("Erreur lors de l'ajout du nouveau matériel.");
    callback({ok: true});
  });
};

let updateMateriel = (id, data, callback) => {
  Materiel.findById(id, (err, materiel) => {
    if (err) throw new Error('Erreur lors de la récupération du matériel à mettre à jour.');
    if (materiel === null) return callback({ok: false});

    materiel.thumbUrl = data.thumb;
    materiel.extes = data.extes;
    materiel.name = data.name;
    materiel.caution = data.caution;
    materiel.disponible = data.updatedDisponible;
    materiel.historique = data.updatedHistorique;

    materiel.save((err) => {
      if (err) throw new Error('Erreur lors de la mise à jour du matériel.');
      callback({ok: true});
    });
  });
};

module.exports = {returnUser: returnUser, returnListVideos: returnVideo, returnVideo: returnVideo, addVideo: addVideo, updateVideo: updateVideo,
                  returnListMateriel: returnListMateriel, addMateriel: addMateriel, updateMateriel: updateMateriel};
