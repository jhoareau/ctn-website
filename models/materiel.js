let mongoose = require('mongoose');

let matosSchema = new mongoose.Schema({
  extes: Boolean,
  name: String,
  description: String,
  caution: Number,
  disponible: Boolean,
  historique: [{
    emprunteur: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date_emprunt: Date,
    responsable_emprunt: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    rendu_le: Date,
    responsable_rendu: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    valide: Boolean
  }]
});

let Materiel = mongoose.model('Materiel', matosSchema);
exports.model = Materiel;

exports.returnListMateriel = (admin, callback) => {
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

exports.addMateriel = (data, callback) => {
  let schema = {
    extes: data.extes,
    name: data.name,
    description: data.description,
    caution: data.caution,
    disponible: true,
    historique: []
  };

  let newMateriel = new Materiel(schema);
  newMateriel.save((err, obj) => {
    if (err) throw new Error("Erreur lors de l'ajout du nouveau matériel.");
    callback({id: obj.id});
  });
};

exports.updateMateriel = (id, data, callback) => {
  Materiel.findById(id, (err, materiel) => {
    if (err) throw new Error('Erreur lors de la récupération du matériel à mettre à jour.');
    if (materiel === null) return callback({ok: false});

    if (materiel.thumbUrl) materiel.thumbUrl = data.thumb;
    materiel.extes = data.extes;
    materiel.name = data.name;
    materiel.caution = data.caution;
    materiel.disponible = data.updatedDisponible;
    if (data.updatedHistorique) materiel.historique = data.updatedHistorique;

    materiel.save((err) => {
      if (err) throw new Error('Erreur lors de la mise à jour du matériel.');
      callback({ok: true});
    });
  });
};
