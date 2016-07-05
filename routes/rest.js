let express = require('express');
let router = express.Router();
let mongodb = require('../models/mongodb.js');

const loggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    next();
  else {
    req.session.redirectTo = req.path;
    res.redirect('/login');
  }
}

// Routes REST
router.get('/header', (req, res) => {
  if (!req.isAuthenticated())
    return res.json([ { title: "Connexion", href: '/login' }, { title: "A propos", href: '/a-propos' } ]);
  if (req.user.admin)
    return res.json([
            { title: "Mediapiston", href: '/mediapiston' },
            { title: "Matériel", href: '/pret-matos' },
            { title: "A propos", href: '/a-propos' },
            { title: "Admin", href: '/ctn-asso' },
            { title: "Déconnexion", href: '/logout', logout: true },
           ]);
  res.json([
          { title: "Mediapiston", href: '/mediapiston' },
          { title: "Matériel", href: '/pret-matos' },
          { title: "A propos", href: '/a-propos' },
          { title: "Déconnexion", href: '/logout', logout: true },
        ]);
});

router.get('/videoList', loggedIn, (req, res) => {
  mongodb.returnListVideos(null, data => {
    if (data === null) data = [];
    return res.json(data);
  });
});

module.exports = router;
