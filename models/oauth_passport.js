let mongoDB = require('./mongodb');
let request = require('superagent');

let serializeUser = (user, done) => {
  done(null, user.username);
}
let deserializeUser = (username, done) => {
  mongoDB.user.return({username: username}, (user) => {
    return done(null, user);
  });
}

let authenticator = (accessToken, refreshToken, profile, done) => {
  request.get('https://www.myecl.fr/api/users').set('Authorization', 'Bearer ' + accessToken).end((err, res) => {
    mongoDB.user.return(res.body, (user) => {
      return done(null, user);
    });
  });
}

module.exports = {serializeUser: serializeUser, deserializeUser: deserializeUser, authenticator: authenticator};
