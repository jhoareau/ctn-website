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

router.get('/pret-matos', loggedIn, (req, res) => {
  res.render('materiel');
});

router.get('/a-propos', (req, res) => {
  res.redirect('/');
});

router.get('/ctn-asso', loggedIn, (req, res, next) => {
  if (req.user.admin)
    res.redirect('/');
  else next();
});

module.exports = (passportMiddleware) => {
  router.use(passportMiddleware);
  router.post('/login',
      function (req, res) {
        res.redirect(req.session.redirectTo || '/')
        delete req.session.redirectTo;
  });

  return router;
};
