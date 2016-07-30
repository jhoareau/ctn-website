const express = require('express');
const router = express.Router();
const mongodb = require('../models/mongodb.js');
const fs = require('fs');
const path = require('path');

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
router.get('/mediapiston/adminFeatures', loggedIn, (req, res) => {
  if (req.user.admin)
    return res.json([
            { title: "Ajouter une vidéo", href: '/mediapiston/upload' }
                    ]);
  res.json([]);
});
router.get('/pret-matos/adminFeatures', loggedIn, (req, res) => {
  if (req.user.admin)
    return res.json([
            { title: "Ajouter un matériel", href: '/pret-matos/add' },
            { title: "Gérer le matériel", href: '/pret-matos/admin' }
                    ]);
  res.json([]);
});

router.get('/videoList', loggedIn, (req, res) => {
  mongodb.returnListVideos(null, data => {
    if (data === null) data = [];
    return res.json(data);
  });
});

router.get('/video/:id', loggedIn, (req, res) => {
  mongodb.returnListVideos(req.params.id, data => {
    if (data === null) data = {};
    return res.json(data);
  });
});

router.post('/video/:id/update', isAdmin, (req, res) => {
  mongodb.updateMateriel(req.params.id, req.body, answer => res.json(answer));
});

router.put('/video/add', isAdmin, (req, res) => {
  let uploader = req.user;
  let request = req.body;
  request.session = uploader;
  let thumbnailData = request.thumbnail.replace(/^data:image\/png;base64,/, '');
  fs.writeFile(path.join(__dirname, '../videos/', request._id + '.png'), thumbnailData, 'base64', err => {if (err) throw err;});
  mongodb.updateVideo(request._id, request, answer => res.json(answer));
});

router.get('/pret-matos/public', loggedIn, (req, res) => {
  mongodb.returnListMateriel(null, data => {
    if (data === null) data = [];
    return res.json(data);
  });
});

router.get('/pret-matos/admin', isAdmin, (req, res) => {
  mongodb.returnListMateriel(true, data => {
    if (data === null) data = [];
    return res.json(data);
  });
});

router.post('/pret-matos/:id/update', isAdmin, (req, res) => {
  mongodb.updateMateriel(req.params.id, req.body, answer => res.json(answer));
});

router.put('/pret-matos/add', isAdmin, (req, res) => {
  mongodb.addMateriel(req.body, answer => res.json(answer));
});

module.exports = router;
