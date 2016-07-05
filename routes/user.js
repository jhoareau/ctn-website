let routes = require(__dirname + "/index.js");

exports.createRoutes = function (app) {
  app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect(req.session.redirectTo || '/')
      delete req.session.redirectTo;
    }
    else res.render('login');
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/login/callback', routes.loggedIn, (req, res) => {
    res.redirect('/');
  });
}
