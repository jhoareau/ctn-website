let mongoose = require('mongoose');

let loanSchema = new mongoose.Schema({
  item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
  borrower: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  status: {type: String, default: 'pending'},
  request_date: {type: Date, default: Date.now},
  message_borrower: String,
  desired_start_date_loan: Date,
  desired_end_date_loan: Date,
  in_charge_request: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  message_in_charge_request : String,
  loan_date: Date,
  cancellation_date: Date,
  in_charge_loan: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  rendu_le: Date,
  responsable_rendu: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

let Loan = mongoose.model('Loan', loanSchema);
exports.model = Loan;

exports.create = (data, callback) => {
  let schema = {
    item: data.item,
    borrower: data.session._id,
    message_borrower: data.message,
    desired_start_date_loan: data.start_date,
    desired_start_date_loan: data.end_date
  };

  let newLoan = new Loan(schema);
  newLoan.save((err, result) => {
    if (err || typeof result === 'undefined') {
      return callback(new Error("Erreur lors de la création du nouveau prêt."));
    }
    callback(null, result);
  });
}

exports.returnListByItem = (itemId, status, callback) => {
  let mongo_query = !status || typeof status === 'undefined' ? {item: itemId} : {item: itemId, status: status};

  Loan.find(mongo_query).sort('-request_date').exec((err, result) => {
    if (err) return callback(null, new Error('Erreur lors de la récupération de la liste des prêts.'));
    if (result === null || typeof result === 'undefined') return callback(null);

    callback(result);
  });
}

exports.getLentOne = (callback => {
  Loan.findOne({status:'lent'}, (err, loan) => {
    if (err || !loan) return callback();
    callback(loan);
  });
});

exports.update = (id, data, callback) => {
  Loan.findById(id, (err, loan) => {
    if (err) return callback(err);
    if (loan === null) return callback(new Error(`Erreur lors de la récupération du prêt à mettre à jour. ID =${id}`));

    if (data.in_charge_request) loan.in_charge_request = data.in_charge_request;
    if (data.message) loan.message_in_charge_request = data.message;
    if (data.status) loan.status = data.status;
    if (data.in_charge_loan) loan.in_charge_loan = data.in_charge_loan;
    if (data.loan_date) loan.loan_date = data.loan_date;

    item.save(err => {
      if (err) return callback(err);
      callback();
    });
  });
};
