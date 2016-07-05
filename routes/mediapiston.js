let routes = require(__dirname + "/index.js");

exports.createRoutes = function (app) {

  app.get('/mediapiston', routes.loggedIn, (req, res) => {
    res.render('mediapiston_home');
  });

  app.get('/mediapiston/watch/:videoid', routes.loggedIn, (req, res) => {
    res.render('mediapiston_video');
  });
}
