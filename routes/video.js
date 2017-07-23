const routes = require('./rest.js');
const express = require('express');
const mongodb = require('../models/mongodb.js');
const fs = require('fs');
const path = require('path');

const videoRoutes = (winston) => {

  let router = express.Router();

  router.get('/', routes.loggedIn, (req, res) => {

    let query = {
      page: Math.max(1, Number(req.query.page) || 1),
      per_page: Number(req.query.per_page) || 20
    }

    if (query.per_page < 1 || query.per_page > 1000) {
      winston.log('error', `${req.method} ${req.originalUrl} - The user queried a per_page number greater than 1000`);
      return res.status(400).json({error: `per_page number must be set between 1 and 1000`});
    }

    if (query.page > Math.ceil(index.nbImages/query.per_page)) {
      winston.log('error', `${req.method} ${req.originalUrl} - The user queried a page that doesn't exist with per_page ${query.per_page}`);
      return res.status(400).json({error: `Your page doesn't exist with per_page ${query.per_page}: not enough images`});
    }

    mongodb.video.returnList(query, (data, err) => {
      if (err) winston.log('warning', 'VideoList / ' + err.message);
      if (data === null) data = [];
      return res.json(data);
    });
  });

  router.get('/related/:id', routes.loggedIn, (req, res) => {
    // TODO vidéos liées à la vidéo en paramètre
    mongodb.video.getRelatedVideos(req.params.id, (data, err) => {
      if (err) winston.log('warning', 'VideoList Related / ' + err.message);
      if (data === null) data = [];
      return res.json(data.slice(0, 5));
    });
  });

  router.get('/search/:title', routes.loggedIn, (req, res) => {
    mongodb.video.searchRelatedVideos(req.params.title, (data, err) => {
      if (err) winston.log('warning', 'VideoList Search / ' + err.message);
      if (data === null) data = [];
      return res.json(data);
    });
  });

  router.get('/:id', routes.loggedIn, (req, res) => {
    mongodb.video.return(req.params.id, null, (data, err) => {
      if (err) winston.log('warning', 'Video / ' + err.message);
      if (data === null || data === {}) {
        data = {};
        return res.status(404).send(data);
      }

      data.isAdmin = req.user.admin;
      return res.json(data);
    });
  });

  router.put('/', routes.isAdmin, (req, res) => {
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

  router.post('/:id', routes.isAdmin, (req, res) => {
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

  router.delete('/:id', routes.isAdmin, (req, res) => {
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

  router.get('/:id/comments', routes.loggedIn, (req, res) => {
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
  });

  router.put('/:id/comments', routes.loggedIn, (req, res) => {
    let request = {session: req.user, text: req.body.commentText, videoId: req.params.id};
    mongodb.comment.create(request, (answer, err) => {
      if (err) {
        winston.log('warning', 'Comment Creation / ' + err.message);
        return res.status(500).send(answer);
      }
      return res.json(answer);
    });
  });

  router.post('/comments/:id_c', routes.loggedIn, (req, res) => {
    mongodb.comment.updateText(req.params.id_c, req.body.commentText, req.user.admin ? null : req.user._id, (answer, err) => {
      if (err) {
        winston.log('warning', 'Comment Edit / ' + err.message);
        return res.status(500).send(answer);
      }
      if (typeof answer.unauthorised !== 'undefined' && answer.unauthorised) return res.status(403).send(answer);

      return res.json(answer);
    })
  });

  router.delete('/comments/:id_c', routes.loggedIn, (req, res) => {
    mongodb.comment.delete(req.params.id_c, req.user.admin ? null : req.user._id, (answer, err) => {
      if (err) {
        winston.log('warning', 'Comment Delete / ' + err.message);
        return res.status(500).send(answer);
      }
      if (typeof answer.unauthorised !== 'undefined' && answer.unauthorised) return res.status(403).send(answer);

      return res.json(answer);
    });
  });

  return router;
}

module.exports = videoRoutes;
