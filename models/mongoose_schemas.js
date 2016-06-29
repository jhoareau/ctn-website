let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  login: String,
  isAdmin: Boolean
});

let videoListSchema = new mongoose.Schema({
  list: [{
    thumbUrl : String,
    title: String,
    uploadDate: Date,
    uploader: String,
    description: String,
    url: String,
    _id: mongoose.Schema.Types.ObjectId
  }]
});

let matosListSchema = new mongoose.Schema({
  list: [{
    thumbUrl : String,
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
  }]
});

module.exports = {userSchema: userSchema, videoListSchema: videoListSchema, matosListSchema: matosListSchema};
