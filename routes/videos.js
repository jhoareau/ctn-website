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


router.get('/:id.mp4', loggedIn, (req, res) => {
  fs.stat(path.join(__dirname, '../videos/', req.params.id +'.mp4'), (err, stat) => {
    if (err && err.code == 'ENOENT') {
      res.status(404).sendFile(path.join(__dirname, '../public/defaults/', 'no_video.mp4'))
    } else {
      res.sendFile(path.join(__dirname, '../videos/', req.params.id +'.mp4'));
    }
  });
});

router.get('/:id.png', loggedIn, (req, res) => {
  fs.stat(path.join(__dirname, '../videos/', req.params.id +'.png'), (err, stat) => {
    if (err && err.code == 'ENOENT') {
      res.status(404).sendFile(path.join(__dirname, '../public/defaults/', 'no_video.png'));
    } else {
      res.sendFile(path.join(__dirname, '../videos/', req.params.id +'.png'));
    }
  });
});


module.exports = router;
