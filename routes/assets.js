const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const loggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    next();
  else {
    req.session.redirectTo = req.path;
    //res.redirect('/login');
    res.redirect('/');
  }
}

const serveFile = (path, res) => {
  res.sendFile(path);
};

router.get('/:id.png', loggedIn, (req, res) => {
  fs.stat(path.join(__dirname, '../materiel/', req.params.id +'.png'), (err, stat) => {
    if (err && err.code == 'ENOENT') {
      serveFile(path.join(__dirname, '../public/defaults/', 'no_video.png'), res);
    } else {
      serveFile(path.join(__dirname, '../materiel/', req.params.id +'.png'), res);
    }
  });
});


module.exports = router;
