let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  surname: String,
  email: String,
  admin: Boolean,
  superAdmin: Boolean
});

let User = mongoose.model('User', userSchema);
exports.model = User;

exports.return = (userObject, callback) => {
  User.findOne({username: userObject.username}, (err, result) => {
    if (err) throw err;
    if (result == null) {
      var admin = false;
      if (userObject.username == 'jhoareau' || userObject.username == 'adejesus') admin = true;
      let userInstance = new User({username: userObject.username, fullName: userObject.prenom + ' ' + userObject.nom,
                                    surname: userObject.surnom, email: userObject.email, admin: admin, superAdmin: admin});
      userInstance.save((err) => {
        if (err) throw new Error("Erreur de création d'utilisateur dans la BDD");
      });
      return callback(userInstance);
    }
    callback(result);
  });
}
