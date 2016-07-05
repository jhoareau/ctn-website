var routes = require(__dirname + "/index.js");

exports.createRoutes = function (app) {

  app.get('/mediapiston', loggedIn, (req, res) => {
    res.render('mediapiston_home');
  });

  app.get('/mediapiston/watch/:videoid', loggedIn, (req, res) => {
    res.render('mediapiston_video');
  });
}
