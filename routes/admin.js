let routes = require(__dirname + "/index.js");

exports.createRoutes = function (app) {

  app.get('/ctn-asso', routes.loggedIn, (req, res, next) => {
    if (req.user.admin)
      res.redirect('/');
    else next();
  });
}
