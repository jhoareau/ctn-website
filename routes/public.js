let express = require('express');
let router = express.Router();

const loggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    next();
  else {
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
  res.render('index');
});

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect(req.session.redirectTo || '/')
    delete req.session.redirectTo;
  }
  else res.render('login');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/login/callback', loggedIn, (req, res) => {
  res.redirect('/');
});

router.get('/mediapiston', loggedIn, (req, res) => {
  res.render('mediapiston_home');
});

router.get('/mediapiston/watch/:videoid', loggedIn, (req, res) => {
  res.render('mediapiston_video');
});

router.get('/mediapiston/upload', isAdmin, (req, res) => {
  res.render('mediapiston_upload');
});

router.get('/mediapiston/update/:id', isAdmin, (req, res) => {
  res.render('mediapiston_upload', {update: true});
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
  router.post('/login', passportMiddleware);
  router.post('/login',
      function (req, res) {
        res.redirect(req.session.redirectTo || '/')
        delete req.session.redirectTo;
  });

  return router;
};
