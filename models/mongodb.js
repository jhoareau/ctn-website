let mongoose = require('mongoose');
let {userSchema: userSchema} = require('./mongoose_schemas');

mongoose.connect('mongodb://localhost/test');

let returnUser = (username, callback) => {
  let User = mongoose.model('User', userSchema);
  User.findOne({username: username}, (err, result) => {
    if (err) throw err;
    if (result == null) throw new Error('User not found');
    callback(result);
  });
}

module.exports = {returnUser: returnUser};
