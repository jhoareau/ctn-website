const routes = require('./rest.js');
const express = require('express');
const mongodb = require('../models/mongodb.js');
const fs = require('fs');
const path = require('path');

const materielRoutes = (winston) => {

  let router = express.Router();

  router.get('/matos/public', routes.loggedIn, (req, res) => {
    mongodb.materiel.returnList(null, data => {
      if (data === null) data = [];
      return res.json(data);
    });
  });

  router.get('/matos', routes.loggedIn, (req, res) => {
    mongodb.materiel.returnList(req.user.admin, data => {
      if (data === null) data = [];
      return res.json(data);
    });
  });

  router.post('/matos/:id/update', routes.isAdmin, (req, res) => {
    mongodb.materiel.update(req.params.id, req.body, answer => res.json(answer));
  });

  router.put('/matos/add', routes.isAdmin, (req, res) => {
    mongodb.materiel.add(req.body, answer => {
      let thumbnailData = req.body.thumbnail.replace(/^data:image\/png;base64,/, '');
      fs.writeFile(path.join(__dirname, '../materiel/', answer.id + '.png'), thumbnailData, 'base64', err => {if (err) throw err;});
      return res.json({ok: true});
    });
  });

  return router;
}

module.exports = materielRoutes;
