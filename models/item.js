let mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
  publiclyAvailable: Boolean,
  name: String,
  description: String,
  deposit: Number,
  image: Buffer,
  loans: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Loan'} ]
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
    Item.find({publiclyAvailable: true}, (err, result) => {
      if (err) throw new Error('Erreur lors de la récupération de la liste des items disponibles.');
      callback(result);
    });
  }
};

exports.add = (data, callback) => {
  let schema = {
    publiclyAvailable: data.publiclyAvailable,
    name: data.name,
    description: data.description,
    deposit: data.deposit,
    image: data.image
  };

  let newItem = new Item(schema);
  newItem.save((err, obj) => {
    if (err) throw new Error("Erreur lors de l'ajout du nouvel item.");
    callback({id: obj.id});
  });
};

exports.update = (id, data, callback) => {
  Item.findById(id, (err, item) => {
    if (err) return callback(err);
    if (item === null) return callback(new Error(`Erreur lors de la récupération de l'item à mettre à jour. ID =${id}`));

    if (data.publiclyAvailable) item.publiclyAvailable = data.publiclyAvailable;
    if (data.name) item.name = data.name;
    if (data.deposit) item.deposit = data.deposit;
    if (data.description) item.description = data.description;
    if (data.image) item.image = data.image;

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
