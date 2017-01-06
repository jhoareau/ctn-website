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
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/', (req, res) => {
  res.render('react_container');
});

router.get(['/mediapiston', '/mediapiston/*'], loggedIn, (req, res) => {
  res.render('react_container');
});

router.get('/news', (req, res) => {
  res.redirect('/');
})

router.get('/news/*', loggedIn, (req, res) => {
  res.render('react_container');
});

router.get(['/matos', '/matos/*'], loggedIn, (req, res) => {
  res.render('react_container');
});

router.get('/a-propos', (req, res) => {
  res.redirect('react_container');
});

router.get('/ctn-asso', isAdmin, (req, res, next) => {
  res.render('react_container');
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
