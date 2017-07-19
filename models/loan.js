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
  rendu_le: Date,
  responsable_rendu: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  valide: Boolean
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

exports.update = (id, data, callback) => {

}
