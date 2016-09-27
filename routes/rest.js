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
    return res.json([
      { title: "Connexion", href: '/login' },
      { title: "A propos", src: 'apropos', href: '/a-propos' }
    ]);
  if (req.user.admin)
    return res.json([
            { title: "Mediapiston", src: 'mediapiston', href: '/mediapiston' },
            { title: "Matériel", src: 'pret', href: '/pret-matos' },
            { title: "A propos", src: 'apropos', href: '/a-propos' },
            { title: "Admin", src: 'admin', href: '/ctn-asso' },
            { title: "Déconnexion", href: '/logout', logout: true },
           ]);
  res.json([
          { title: "Mediapiston", src: 'mediapiston', href: '/mediapiston' },
          { title: "Matériel", src: 'pret', href: '/pret-matos' },
          { title: "A propos", src: 'apropos', href: '/a-propos' },
          { title: "Déconnexion", href: '/logout', logout: true }
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
  mongodb.video.returnVideoList(data => {
    if (data === null) data = [];
    return res.json(data);
  });
});

router.get('/videoList/related/:id', loggedIn, (req, res) => {
  // TODO vidéos liées à la vidéo en paramètre
  mongodb.video.returnRelatedVideos(req.params.id, data => {
    if (data === null) data = [];
    return res.json(data.slice(0, 5));
  });
});

router.get('/video/:id', loggedIn, (req, res) => {
  mongodb.video.returnVideo(req.params.id, data => {
    if (data === null) data = {};
    if (data.length !== 0) data = data.toObject();
    data.isAdmin = req.user.admin;
    return res.json(data);
  });
});

router.post('/video/:id/update', isAdmin, (req, res) => {
  mongodb.video.updateVideo(req.params.id, req.body, answer => res.json(answer));
  let request = req.body;
  if (request.thumbnail) {
    let thumbnailData = request.thumbnail.replace(/^data:image\/png;base64,/, '');
    fs.writeFile(path.join(__dirname, '../videos/', req.params.id + '.png'), thumbnailData, 'base64', err => {if (err) throw err;});
  }
});

router.delete('/video/:id/delete', isAdmin, (req, res) => {
  mongodb.video.deleteVideo(req.params.id, data => {
    fs.unlink(path.join(__dirname, '../videos/', req.params.id + '.mp4'), err => {});
    fs.unlink(path.join(__dirname, '../videos/', req.params.id + '.png'), err => {});
    return res.json(data);
  });
});

router.put('/video/add', isAdmin, (req, res) => {
  let uploader = req.user;
  let request = req.body;
  request.session = uploader;
  request.date = new Date();
  let thumbnailData = request.thumbnail.replace(/^data:image\/png;base64,/, '');
  fs.writeFile(path.join(__dirname, '../videos/', request._id + '.png'), thumbnailData, 'base64', err => {if (err) throw err;});
  mongodb.video.updateVideo(request._id, request, answer => res.json(answer));
});

router.get('/comment/:id', loggedIn, (req, res) => {
  mongodb.comment.return(req.params.id, (comment) => {
    res.send(comment);
  });
});

router.post('/comment/add', loggedIn, (req, res) => {
  let request = req.body;
  mongodb.comment.create(request, (result) => {
    res.send(comment);
  })
});

router.get('/pret-matos/public', loggedIn, (req, res) => {
  mongodb.materiel.returnListMateriel(null, data => {
    if (data === null) data = [];
    return res.json(data);
  });
});

router.get('/pret-matos/admin', isAdmin, (req, res) => {
  mongodb.materiel.returnListMateriel(true, data => {
    if (data === null) data = [];
    return res.json(data);
  });
});

router.post('/pret-matos/:id/update', isAdmin, (req, res) => {
  mongodb.materiel.updateMateriel(req.params.id, req.body, answer => res.json(answer));
});

router.put('/pret-matos/add', isAdmin, (req, res) => {
  mongodb.materiel.addMateriel(req.body, answer => {
    let thumbnailData = req.body.thumbnail.replace(/^data:image\/png;base64,/, '');
    fs.writeFile(path.join(__dirname, '../materiel/', answer.id + '.png'), thumbnailData, 'base64', err => {if (err) throw err;});
    return res.json({ok: true});
  });
});

module.exports = router;
