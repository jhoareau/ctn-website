const mongoose = require('mongoose');
const {userSchema: userSchema, videoSchema: videoSchema, matosSchema: matosSchema} = require('./mongoose_schemas');
const config = require('../config.secrets.json');
const glob = require('glob');
const async = require('async');

mongoose.connect('mongodb://' + config.mongo.server + '/' + config.mongo.db, {
  user: config.mongo.user,
  pass: config.mongo.password
});

let returnUser = (userObject, callback) => {
  let User = mongoose.model('User', userSchema);
  User.findOne({username: userObject.username}, (err, result) => {
    if (err) throw err;
    if (result == null) {
      let userInstance = new User({username: userObject.username, fullName: userObject.prenom + ' ' + userObject.nom,
                                    surname: userObject.surnom, email: userObject.email, admin: true, superAdmin: true});
      userInstance.save((err) => {
        if (err) throw new Error("Erreur de création d'utilisateur dans la BDD");
      });
      return callback(userInstance);
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

let generateVideoID = (callback) => {
  let Video = mongoose.model('Video', videoSchema);
  let schema = {};

  let newVideo = new Video(schema);
  newVideo.save((err, importedObject) => {
    if (err) throw new Error("Erreur lors de l'ajout de la nouvelle vidéo.");
    callback(importedObject._id);
  });
};

let updateVideo = (id, data, callback) => {
  let Video = mongoose.model('Video', videoSchema);

  Video.findById(id, (err, video) => {
    if (err) throw new Error('Erreur lors de la récupération de la vidéo à mettre à jour.');
    if (video === null) return callback({ok: false});

    video.title = data.title;
    video.description = data.description;
    video.date = data.date;
    video.uploader = data.session.uploader;

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

module.exports = {returnUser: returnUser,
                  returnListVideos: returnVideo, returnVideo: returnVideo,
                  generateVideoID: generateVideoID, updateVideo: updateVideo,
                  returnListMateriel: returnListMateriel,
                  addMateriel: addMateriel, updateMateriel: updateMateriel};
