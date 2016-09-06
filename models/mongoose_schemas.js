let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  surname: String,
  email: String,
  admin: Boolean,
  superAdmin: Boolean
});

let videoSchema = new mongoose.Schema({
    title: String,
    uploadDate: Date,
    uploader: String,
    description: String,
    views: Number
});

let matosSchema = new mongoose.Schema({
  extes: Boolean,
  name: String,
  description: String,
  caution: Number,
  disponible: Boolean,
  historique: [{
    emprunteur: String,
    date_emprunt: Date,
    responsable_emprunt: String,
    rendu_le: Date,
    responsable_rendu: String,
    valide: Boolean
  }]
});

module.exports = {userSchema: userSchema, videoSchema: videoSchema, matosSchema: matosSchema};
