let mongoose = require('mongoose');
let {userSchema: userSchema, videoSchema: videoSchema, matosSchema: matosSchema} = require('./mongoose_schemas');

mongoose.connect('mongodb://localhost/test');

let returnUser = (username, callback) => {
  let User = mongoose.model('User', userSchema);
  User.findOne({username: username}, (err, result) => {
    if (err) throw err;
    if (result == null) {
      let userInstance = new User({username: username, admin: false});
      userInstance.save((err) => {
        if (err) throw new Error("Erreur de création d'utilisateur dans la BDD");
      });
      callback(userInstance);
    }
    callback(result);
  });
}

let returnVideo = (id, callback) => {
  let Video = mongoose.model('Video', videoSchema);
  if (id === null) {
    Video.find({}, (err, result) => {
      if (err) throw new Error('Erreur lors de la récupération de la liste des vidéos.');
      callback(result);
    })
  }
  else {
    Video.findOne({_id: id}, (err, result) => {
      if (err) throw new Error('Erreur lors de la récupération de la vidéo.');
      callback(result);
    })
  }
}

module.exports = {returnUser: returnUser, returnListVideos: returnVideo, returnVideo: returnVideo};
