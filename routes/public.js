let express = require('express');
let router = express.Router();

const loggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    next();
  else {
    if (typeof req.session === 'undefined') req.session = {};
    req.session.redirectTo = req.path;
    res.redirect('/login');
  }
}

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin)
    next();
  else {
    res.status(404);
    res.render('error', {
        message: 'Page non trouvée !',
        error: {}
    });
  }
}

router.get('/', (req, res) => {
  //res.render('index');
  res.redirect('/mediapiston');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get(['/mediapiston', '/mediapiston/*'], loggedIn, (req, res) => {
  res.render('react_container');
});

router.get('/pret-matos', loggedIn, (req, res) => {
  res.render('materiel');
});

router.get('/pret-matos/add', isAdmin, (req, res) => {
  res.render('materiel_add');
});

router.get('/pret-matos/update/:id', isAdmin, (req, res) => {
  res.render('materiel_add', {update: true});
});

router.get('/a-propos', (req, res) => {
  res.redirect('/');
});

router.get('/ctn-asso', isAdmin, (req, res, next) => {
  res.render('admin');
});

module.exports = (passportMiddleware) => {
  router.get('/login', passportMiddleware);
  router.get('/login/callback', passportMiddleware, (req, res) => {
    if (typeof req.session !== 'undefined' && typeof req.session.redirectTo !== 'undefined') {
      res.redirect(req.session.redirectTo);
      delete req.session.redirectTo;
      return;
    }
    res.redirect('/');
  });

  return router;
};
