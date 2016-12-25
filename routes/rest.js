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
    res.status(403);
    res.render('error', {
        message: 'Action non autorisée !',
        error: {}
    });
  }
}

const isSuperAdmin = (req, res, next) => {
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

const routerWithErrorLogger = (winston) => {
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
              { title: "Matériel", src: 'pret', href: '/matos' },
              { title: "A propos", src: 'apropos', href: '/a-propos' },
              { title: "Admin", src: 'admin', href: '/ctn-asso' },
              { title: "Déconnexion", href: '/logout', logout: true },
            ]);
    res.json([
            { title: "Mediapiston", src: 'mediapiston', href: '/mediapiston' },
            { title: "Matériel", src: 'pret', href: '/matos' },
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

  router.get('/matos/adminFeatures', loggedIn, (req, res) => {
    if (req.user.admin)
      return res.json([
              { title: "Ajouter un matériel", href: '/matos/add' },
              { title: "Gérer le matériel", href: '/matos/admin' }
                      ]);
    res.json([]);
  });

  router.get('/videoList', loggedIn, (req, res) => {
    mongodb.video.returnList((data, err) => {
      if (err) winston.log('warning', 'VideoList / ' + err.message);
      if (data === null) data = [];
      return res.json(data);
    });
  });

  router.get('/videoList/related/:id', loggedIn, (req, res) => {
    // TODO vidéos liées à la vidéo en paramètre
    mongodb.video.getRelatedVideos(req.params.id, (data, err) => {
      if (err) winston.log('warning', 'VideoList Related / ' + err.message);
      if (data === null) data = [];
      return res.json(data.slice(0, 5));
    });
  });

  router.get('/videoList/search/:title', loggedIn, (req, res) => {
    mongodb.video.searchRelatedVideos(req.params.title, (data, err) => {
      if (err) winston.log('warning', 'VideoList Search / ' + err.message);
      if (data === null) data = [];
      return res.json(data);
    });
  });

  router.get('/video/:id', loggedIn, (req, res) => {
    mongodb.video.return(req.params.id, (data, err) => {
      if (err) winston.log('warning', 'Video / ' + err.message);
      if (data === null || data === {}) {
        data = {};
        return res.status(404).send(data);
      }

      data.isAdmin = req.user.admin;
      return res.json(data);
    });
  });

  router.get('/video/:id/comments', loggedIn, (req, res) => {
    mongodb.comment.getByVideo(req.params.id, (data, err) => {
      if (err) winston.log('warning', 'Video Comments / ' + err.message);
      if (data === null || data === []) {
        data = [];
        return res.status(404).send(data);
      }
      filteredData = data.map(obj => {
        if (obj.user.id == req.user._id || req.user.admin) {
          obj.edit = true;
        }
        obj.user = obj.user.name;
        return obj;
      });

      return res.json(filteredData);
    })
  })

  router.post('/video/:id/update', isAdmin, (req, res) => {
    mongodb.video.update(req.params.id, req.body, (answer, err) => {
      if (err) {
        winston.log('warning', 'Video Update / ' + err.message);
        return res.status(500).send(answer);
      }
      return res.json(answer);
    });
    let request = req.body;
    if (request.thumbnail) {
      let thumbnailData = request.thumbnail.replace(/^data:image\/png;base64,/, '');
      fs.writeFile(path.join(__dirname, '../videos/', req.params.id + '.png'), thumbnailData, 'base64', err => {if (err) winston.log('warning', 'Thumbnail IO error / ' + err.message);});
    }
  });

  router.delete('/video/:id/delete', isAdmin, (req, res) => {
    mongodb.video.delete(req.params.id, (data, err) => {
      if (err) {
        winston.log('warning', 'Video Delete / ' + err.message);
        return res.status(500).send(data);
      }
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
    fs.writeFile(path.join(__dirname, '../videos/', request._id + '.png'), thumbnailData, 'base64', err => {if (err) winston.log('warning', 'Thumbnail IO error / ' + err.message);});
    mongodb.video.update(request._id, request, (answer, err) => {
      if (err) {
        winston.log('warning', 'Video Creation / ' + err.message);
        return res.status(500).send(answer);
      }
      return res.json(answer);
    });
  });

  router.put('/video/:id/comments/add', loggedIn, (req, res) => {
    let request = {session: req.user, text: req.body.commentText, videoId: req.params.id};
    mongodb.comment.create(request, (answer, err) => {
      if (err) {
        winston.log('warning', 'Comment Creation / ' + err.message);
        return res.status(500).send(answer);
      }
      return res.json(answer);
    });
  });

  router.post('/video/comments/:id_c/update', loggedIn, (req, res) => {
    mongodb.comment.updateText(req.params.id_c, req.body.commentText, req.user.admin ? null : req.user._id, (answer, err) => {
      if (err) {
        winston.log('warning', 'Comment Edit / ' + err.message);
        return res.status(500).send(answer);
      }
      if (typeof answer.unauthorised !== 'undefined' && answer.unauthorised) return res.status(403).send(answer);

      return res.json(answer);
    })
  });

  router.delete('/video/comments/:id_c/delete', loggedIn, (req, res) => {
    mongodb.comment.delete(req.params.id_c, req.user.admin ? null : req.user._id, (answer, err) => {
      if (err) {
        winston.log('warning', 'Comment Delete / ' + err.message);
        return res.status(500).send(answer);
      }
      if (typeof answer.unauthorised !== 'undefined' && answer.unauthorised) return res.status(403).send(answer);

      return res.json(answer);
    });
  });


  router.get('/matos/public', loggedIn, (req, res) => {
    mongodb.materiel.returnList(null, data => {
      if (data === null) data = [];
      return res.json(data);
    });
  });

  router.get('/matos/admin', isAdmin, (req, res) => {
    mongodb.materiel.returnList(true, data => {
      if (data === null) data = [];
      return res.json(data);
    });
  });

  router.post('/matos/:id/update', isAdmin, (req, res) => {
    mongodb.materiel.update(req.params.id, req.body, answer => res.json(answer));
  });

  router.put('/matos/add', isAdmin, (req, res) => {
    mongodb.materiel.add(req.body, answer => {
      let thumbnailData = req.body.thumbnail.replace(/^data:image\/png;base64,/, '');
      fs.writeFile(path.join(__dirname, '../materiel/', answer.id + '.png'), thumbnailData, 'base64', err => {if (err) throw err;});
      return res.json({ok: true});
    });
  });

  return router;
}

module.exports = routerWithErrorLogger;
