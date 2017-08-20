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

  router.get('/:id', routes.loggedIn, (req, res) => {
    mongodb.item.return(req.params.id, (err, item) => {
      if (err) {
        winston.log('warning', 'Item get / ' + err.message);
        return res.status(500).json({error: "Server error while getting the requested item"});
      }
      res.json(item);
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

  router.put('/:id/request', routes.loggedIn, (req, res) => {
    let data = req.body;
    data.session = req.user;
    data.item = req.params.id;

    mongodb.loan.create(data, (err, answer) => {
      if (err) {
        winston.log('warning', 'Loan Creation / ' + err.message);
        return res.status(500).throw(err);
      }
      res.json(answer);
    });
  });

  router.get('/:id/requests', routes.isAdmin, (req, res) => {
    mongodb.loan.returnListByItem(req.params.id, 'pending', (err, loans) => {
      if (err) {
        winston.log('warning', 'Loan Returning / ' + err.message);
        return res.status(500).throw(err);
      }
      res.json(loans);
    });
  });

  router.post('/:id_i/request/:id', routes.isAdmin, (req, res) => {
    let data = req.body;
    data.in_charge_request = req.user._id;

    mongodb.loan.update(req.params.id, data, err => {
      if (err) {
        winston.log('warning', 'Loan Validation / Loan update / ' + err.message);
        return res.status(500).throw(err);
      }
      if (data.status === 'accepted') {
        mongodb.item.update(req.params.id_i, {publiclyAvailable: false}, err => {
          if (err) {
            winston.log('warning', 'Loan Validation / Item update / ' + err.message);
            return res.status(500).throw(err);
          }
          res.json({ok:true});
        });
      }
      else {
        res.json({ok:true});
      }
    });
  });

  router.get('/:id/accepted_requests', routes.isAdmin, (req, res) => {
    mongodb.loan.returnListByItem(req.params.id, 'accepted', (err, loans) => {
      if (err) {
        winston.log('warning', 'Loan Returning / ' + err.message);
        return res.status(500).throw(err);
      }
      res.json(loans);
    });
  });

  router.post('/confirm_loan/:id', routes.isAdmin, (req, res) => {
    let data = {
      status: 'lent',
      in_charge_loan: req.user._id,
      loan_date: new Date()
    }

    mongodb.loan.update(req.params.id, data, err => {
      if (err) {
        winston.log('warning', 'Loan Confirm Loan / Loan update / ' + err.message);
        return res.status(500).throw(err);
      }
      res.json({ok:true});
    });
  });

  router.post('/cancel_loan/:id', routes.isAdmin, (req, res) => {
    let data = {
      status: 'cancelled',
      in_charge_loan: req.user._id,
      cancellation_date: new Date()
    }

    mongodb.loan.update(req.params.id, data, err => {
      if (err) {
        winston.log('warning', 'Loan Cancel Loan / Loan update / ' + err.message);
        return res.status(500).throw(err);
      }
      res.json({ok:true});
    });
  });

  router.post('/:id/return', routes.isAdmin, (req, res) => {
    let data = {
      status: 'returned',
      in_charge_return: req.user._id,
    };

    mongodb.loan.getLentOne( loan => {
      if (!loan) {
        winston.log('warning', 'Loan Return / Loan getLentOne / No Loan Found');
        return res.status(404).throw(new Error("Error while getting the loan associated to the lent item"));
      }
      mongodb.loan.update(loan._id, data, err => {
        if (err) {
          winston.log('warning', 'Loan Return / Loan update / ' + err.message);
          return res.status(500).throw(err);
        }
        mongodb.item.update(req.params.id, {publiclyAvailable: true}, err => {
          if (err) {
            winston.log('warning', 'Loan Return / Item update / ' + err.message);
            return res.status(500).throw(err);
          }
          res.json({ok:true});
        });
      });
    });
  });

  return router;
}

module.exports = itemsRoutes;
