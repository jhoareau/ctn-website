let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  username: String,
  admin: Boolean
});

let videoSchema = new mongoose.Schema({
    thumbUrl : String,
    title: String,
    uploadDate: Date,
    uploader: String,
    description: String,
    url: String
});

let matosSchema = new mongoose.Schema({
  thumbUrl : String,
  extes: Boolean,
  name: String,
  caution: String,
  disponible: Boolean,
  emprunteur: String,
  date_emprunt: Date,
  responsable_emprunt: String,
  id_materiel: Number,
  id_histo: mongoose.Schema.Types.ObjectId,
  rendu_le: Date,
  responsable_rendu: String
});

module.exports = {userSchema: userSchema, videoSchema: videoSchema, matosSchema: matosSchema};
