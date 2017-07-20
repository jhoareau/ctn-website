let mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
  extes: Boolean,
  name: String,
  description: String,
  deposit: Number,
  disponible: Boolean,
  // historique: [{
  //   emprunteur: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  //   date_emprunt: Date,
  //   responsable_emprunt: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  //   rendu_le: Date,
  //   responsable_rendu: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  //   valide: Boolean
  // }]
});

let Item = mongoose.model('Item', itemSchema);
exports.model = Item;

exports.returnList = (admin, callback) => {
  if (admin) {
    Item.find({}, (err, result) => {
      if (err) throw new Error('Erreur lors de la récupération de la liste de tous les items (admin).');
      callback(result);
    });
  }
  else {
    Item.find({disponible: true, extes: true}, (err, result) => {
      if (err) throw new Error('Erreur lors de la récupération de la liste des items disponibles.');
      callback(result);
    });
  }
};

exports.add = (data, callback) => {
  let schema = {
    extes: data.extes,
    name: data.name,
    description: data.description,
    deposit: data.deposit,
    disponible: true,
    //historique: []
  };

  let newItem = new Item(schema);
  newItem.save((err, obj) => {
    if (err) throw new Error("Erreur lors de l'ajout du nouveau item.");
    callback({id: obj.id});
  });
};

exports.update = (id, data, callback) => {
  Item.findById(id, (err, item) => {
    if (err) return callback(err);
    if (item === null) return callback(new Error(`Erreur lors de la récupération de l'item à mettre à jour. ID =${id}`));

    if (data.extes) item.extes = data.extes;
    if (data.name) item.name = data.name;
    if (data.deposit) item.deposit = data.deposit;
    if (typeof data.disponible !== 'undefined') item.disponible = data.disponible;
    //if (data.updatedHistorique) item.historique = data.updatedHistorique;

    item.save(err => {
      if (err) return callback(err);
      callback();
    });
  });
};

exports.delete = (id, callback) => {
  Item.findByIdAndRemove(id, (err, result) => {
    if (err) return callback({ok: false}, new Error(`Erreur lors de la suppression d'un item. ID =${id}`));
    callback({ok: true});
  });
}
