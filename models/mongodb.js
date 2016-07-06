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
    Video.findOne({_id: id}, (err, result) => {
      if (err) throw new Error('Erreur lors de la récupération de la vidéo.');
      callback(result);
    });
  }
}

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
    emprunteur: null,
    date_emprunt: null,
    responsable_emprunt: null,
    id_materiel: 0,
    id_histo: null,
    rendu_le: null,
    responsable_rendu: null
  };

  let newMateriel = new Materiel(schema);
  newMateriel.save((err) => {
    if (err) throw new Error("Erreur lors de l'ajout du nouveau matériel.");
    callback({ok: true});
  });
};

let updateMateriel = (id, data, callback) => {

};

module.exports = {returnUser: returnUser, returnListVideos: returnVideo, returnVideo: returnVideo,
                  returnListMateriel: returnListMateriel, addMateriel: addMateriel, updateMateriel: updateMateriel};
