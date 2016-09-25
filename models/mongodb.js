const mongoose = require('mongoose');
const config = require('../config.secrets.json');

mongoose.connect('mongodb://' + config.mongo.server + '/' + config.mongo.db, {
  user: config.mongo.user,
  pass: config.mongo.password
});

exports.user = require('./user.js');
exports.comment = require('./comment.js');
exports.video = require('./video.js');
exports.materiel = require('./materiel.js');
