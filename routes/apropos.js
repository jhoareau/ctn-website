let routes = require(__dirname + "/index.js");

exports.createRoutes = function (app) {

  app.get('/a-propos', (req, res) => {
    res.redirect('/');
  });
}
