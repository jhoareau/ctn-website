const routes = require('./rest.js');
const express = require('express');
const mongodb = require('../models/mongodb.js');
const fs = require('fs');
const path = require('path');

const newsRoutes = (winston) => {

  let router = express.Router();

  router.get('/newsList', (req, res) => {
    mongodb.news.returnList((data, err) => {
      if (err) winston.log('warning', 'News List / ' + err.message);
      if (data === null) data = [];
      data = data.map(obj => {
        delete obj.image;
        delete obj.writer;
        delete obj.date;
        return obj;
      });
      return res.json(data);
    });
  });

  router.get('/news/:id.jpg', (req, res) => {
    mongodb.news.return(req.params.id, (data, err) => {
      if (err) winston.log('warning', 'News / ' + err.message);
      if (data === null) return res.status(404).send(data);
      let img = Buffer.from(data.image.replace(/^data:image\/jpeg;base64,/, ''), 'base64');

      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': img.length
      });
      res.end(img);
    });
  });

  router.get('/news/:id', (req, res) => {
    mongodb.news.return(req.params.id, (data, err) => {
      if (err) winston.log('warning', 'News / ' + err.message);
      if (data === null) return res.status(404).send(data);
      return res.json(data);
    });
  });

  router.get('/newsList/no_images', (req, res) => {
    mongodb.news.returnList((data, err) => {
      if (err) winston.log('warning', 'News List / ' + err.message);
      if (data === null) data = [];
      data = data.map(obj => {
        delete obj.image;
        delete obj.thumbnail;
        return obj;
      });
      return res.json(data);
    });
  });

  router.put('/news/add', routes.isAdmin, (req, res) => {
    let writer = req.user;
    let request = req.body;

    request.session = writer;
    request.date = new Date();
    let imageString = request.image;
    request.image = Buffer.from(imageString.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
    let imageObject = Buffer.from(imageString.replace(/^data:image\/jpeg;base64,/, ''), 'base64');

    require('sharp')(imageObject).resize(160, 90).toBuffer((err, thumbBuffer) => {
      if (err) winston.log('error', 'News Creation / Thumb generation / ' + err.message);
      request.thumbnail = thumbBuffer;
      mongodb.news.create(request, (answer, err) => {
        if (err) {
          winston.log('warning', 'News Creation / ' + err.message);
          return res.status(500).send(answer);
        }
        return res.json(answer);
      });
    });
  });

  router.post('/news/:id/update', routes.isAdmin, (req, res) => {
    let request = req.body;

    if (request.image) {
      let imageString = request.image;
      request.image = Buffer.from(imageString.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
      let imageObject = Buffer.from(imageString.replace(/^data:image\/jpeg;base64,/, ''), 'base64');

      return require('sharp')(imageObject).resize(160, 90).toBuffer((err, thumbBuffer) => {
        if (err) winston.log('error', 'News Creation / Thumb generation / ' + err.message);
        request.thumbnail = thumbBuffer;
        mongodb.news.update(req.params.id, request, (answer, err) => {
          if (err) {
            winston.log('warning', 'News Update / ' + err.message);
            return res.status(500).send(answer);
          }
          return res.json(answer);
        });
      });
    }

    mongodb.news.update(req.params.id, request, (answer, err) => {
      if (err) {
        winston.log('warning', 'News Update / ' + err.message);
        return res.status(500).send(answer);
      }
      return res.json(answer);
    });
  });

  router.delete('/news/:id/delete',routes. isAdmin, (req, res) => {
    mongodb.news.delete(req.params.id, (data, err) => {
      if (err) {
        winston.log('warning', 'News Delete / ' + err.message);
        return res.status(500).send(data);
      }
      return res.json(data);
    });
  });

  return router;
}

module.exports = newsRoutes;
