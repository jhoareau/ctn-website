let routes = require(__dirname + "/index.js");

exports.createRoutes = function (app) {
  app.get('/pret-matos', routes.loggedIn, (req, res) => {
    res.render('materiel');
  });
}
