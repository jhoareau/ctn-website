const routes = require('./rest.js');
const express = require('express');
const mongodb = require('../models/mongodb.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.secrets.json');

const itemsRoutes = (winston) => {

  let router = express.Router();

  router.get('/', routes.loggedIn, (req, res) => {
    mongodb.item.returnList(req.user.admin, data => {
      if (data === null) data = [];
      return res.json(data);
    });
  });

  router.put('/', routes.isAdmin, (req, res) => {
    mongodb.item.add(req.body, answer => {
      let thumbnailData = req.body.thumbnail.replace(/^data:image\/png;base64,/, '');
      fs.writeFile(path.join(__dirname, '../materiel/', answer.id + '.png'), thumbnailData, 'base64', err => {if (err) throw err;});
      return res.json({ok: true});
    });
  });

  router.post('/:id', routes.isAdmin, (req, res) => {
    mongodb.item.update(req.params.id, req.body, err => res.json({ok:true}));
  });

  router.delete('/:id', routes.isAdmin, (req, res) => {
    mongodb.item.delete(req.params.id, answer => res.json(answer));
  });

  router.put('/:id_i/loans', routes.loggedIn, (req, res) => {
    let data = req.body;
    data.session = req.user;
    data.item = req.params.id_i;

    mongodb.loan.create(data, (err, answer) => {
      if (err) {
        winston.log('warning', 'Loan Creation / ' + err.message);
        return res.status(500).throw(err);
      }
      res.json(answer);
    });
  });

  router.post('/loans/:id_l', routes.isAdmin, (req, res) => {

  });

  return router;
}

module.exports = itemsRoutes;