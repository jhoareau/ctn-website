let mongoose = require('mongoose');

let loanSchema = new mongoose.Schema({
  item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
  emprunteur: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  date_demande: {type: Date, default: Date.now},
  message: String,
  date_emprunt_debut_souhaitee: Date,
  date_emprunt_fin_souhaitee: Date,
  date_emprunt: Date,
  responsable_emprunt: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  message_responsable_emprunt : String,
  demande_status: {type: Boolean, default: false},
  rendu_le: Date,
  responsable_rendu: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

let Loan = mongoose.model('Loan', loanSchema);
exports.model = Loan;

exports.create = (data, callback) => {
  let schema = {
    item: data.item,
    emprunteur: data.session._id,
    message: data.message,
    date_emprunt_debut_souhaitee: data.date_debut,
    date_emprunt_fin_souhaitee: data.date_fin
  };

  let newLoan = new Loan(schema);
  newLoan.save((err, result) => {
    if (err || typeof result === 'undefined') {
      return callback(new Error("Erreur lors de la création du nouveau prêt."));
    }
    callback(null, result);
  });
}

exports.return = (id, callback) => {
  if (id === null) {
    News.find({}).select(select).sort('-creationDate').exec((err, result) => {
      if (err) return callback(null, new Error('Erreur lors de la récupération de la liste des prêts.'));
      if (result === null || typeof result === 'undefined') return callback(null);

      callback(result);
    });
  }
  else {
    News.findById(id).populate('emprunteur').exec((err, result) => {
      if (err) return callback(null, new Error('Erreur lors de la récupération du prêt. ID = ' + id));
      if (result === null || typeof result === 'undefined') return callback(null);

      callback(result);
    });
  }
}

exports.returnList = exports.return.bind(this, null);

exports.update = (id, data, callback) => {
  Loan.findById(id, (err, loan) => {
    if (err) return callback(err);
    if (loan === null) return callback(new Error(`Erreur lors de la récupération du prêt à mettre à jour. ID =${id}`));

    if (data.responsable_emprunt) loan.publiclyAvailable = data.responsable_emprunt;
    if (data.message_responsable_emprunt) loan.message_responsable_emprunt = data.message_responsable_emprunt;
    if (typeof data.demande_status !== 'undefined') loan.demande_status = data.demande_status;

    item.save(err => {
      if (err) return callback(err);
      callback();
    });
  });
};
