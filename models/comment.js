let mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
  text: String,
  votes: {type: Number, default: 0},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

let Comment = mongoose.model('Comment', commentSchema);
exports.model = Comment;
