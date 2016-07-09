let mongoDB = require('./mongodb');

let serializeUser = (user, done) => {
  done(null, user.username);
}
let deserializeUser = (username, done) => {
  mongoDB.returnUser(username, (user) => {
    return done(null, user);
  });
}

let isCorrect = (username, password) => {
  let potentialUsers = users.filter(e => e.username === username);
  if (potentialUsers.length > 0 && potentialUsers[0].password === password) return potentialUsers[0];
  else return false;
}

let authenticator = (accessToken, refreshToken, profile, done) => {
  console.log(accessToken); console.log(refreshToken);
  mongoDB.returnUser(username, (user) => {
    return done(null, user);
  });
}

module.exports = {serializeUser: serializeUser, deserializeUser: deserializeUser, authenticator: authenticator};
