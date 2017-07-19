exports.loggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    next();
  else {
    req.session.redirectTo = req.path;
    res.redirect('/login');
  }
}

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin)
    next();
  else {
    res.status(403);
    res.render('error', {
        message: 'Action non autorisée !',
        error: {}
    });
  }
}

exports.isSuperAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.superAdmin)
    next();
  else {
    res.status(403);
    res.render('error', {
        message: 'Action non autorisée !',
        error: {}
    });
  }
}

exports.item = require('./item.js');
exports.news = require('./news.js');
exports.utils = require('./utils.js');
exports.video = require('./video.js');
