let mongoose = require('mongoose');

let voteSchema = new mongoose.Schema({
  voter: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  voteDate: {type: Date, default: Date.now},
  voteType: Number,
  comment: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}
});

let Vote = mongoose.model('Vote', voteSchema);
exports.model = Vote;

exports.create = (infos, callback) => {
  let schema = {
    comment: infos.commment._id,
    voteType: infos.type,
    voter: infos.session._id
  }
  let newVote = new Vote(schema);
  newVote.save((err, result) => {
    if (err) return callback(null, new Error("Erreur lors de la création du vote."));
    callback(result._id);
  });
}

exports.getScoreByCommment = function (commentId, callback) {
  Vote.aggregate(
    {$match: {comment: commentId}},
    {$group: {
        _id: commentId,
        score: {$sum: "$voteType"}
      }
    }, function (err, result) {
      console.log(result);
      callback(err, result)
  });
}

exports.update = function (commentId, voterId, callback) {
  Vote.find({comment: commentId, voter: voterId}, (err, vote) => {
    if (err) return callback({ok: false}, new Error('Erreur lors de la récupération du vote à mettre à jour. ID = ' + id));
    if (vote === null || typeof vote === 'undefined') return callback({ok: false});

    if (data.voteType) vote.voteType = data.voteType;

    vote.save((err2) => {
      if (err2) return callback({ok: false}, new Error('Erreur lors de la mise à jour du vote. ID = ' + id));

      callback({ok: true});
    });
  });
}
