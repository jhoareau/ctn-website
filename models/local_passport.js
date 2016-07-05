let mongoDB = require('./mongodb');
let users = [
  {username: 'test_ctn', password: 'test_ctn'},
  {username: 'jhoareau', password: 'jhoareau'},
  {username: 'zeroA', password: 'zeroA'},
  {username: 'antonio', password: 'antonio'}
];

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

let authenticator = (req, username, password, done) => {
  let accountExists = isCorrect(username, password);
  if (!accountExists) return done(null, false);
  else {
    mongoDB.returnUser(username, (user) => {
      return done(null, user);
    });
  }
}

module.exports = {serializeUser: serializeUser, deserializeUser: deserializeUser, authenticator: authenticator};
