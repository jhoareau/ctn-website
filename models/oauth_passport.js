let mongoDB = require('./mongodb');
let request = require('superagent');

let serializeUser = (user, done) => {
  done(null, user.username);
}
let deserializeUser = (username, done) => {
  mongoDB.user.returnUser({username: username}, (user) => {
    return done(null, user);
  });
}

let isCorrect = (username, password) => {
  let potentialUsers = users.filter(e => e.username === username);
  if (potentialUsers.length > 0 && potentialUsers[0].password === password) return potentialUsers[0];
  else return false;
}

let authenticator = (accessToken, refreshToken, profile, done) => {
  request.get('https://www.myecl.fr/api/users').set('Authorization', 'Bearer ' + accessToken).end((err, res) => {
    mongoDB.user.returnUser(res.body, (user) => {
      return done(null, user);
    });
  });
}

module.exports = {serializeUser: serializeUser, deserializeUser: deserializeUser, authenticator: authenticator};
