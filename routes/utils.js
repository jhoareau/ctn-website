const routes = require('./rest.js');
const express = require('express');
const mongodb = require('../models/mongodb.js');
const fs = require('fs');
const path = require('path');

const utilsRoutes = (winston) => {

  let router = express.Router();

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

  router.get('/mediapiston/adminFeatures', routes.loggedIn, (req, res) => {
    if (req.user.admin)
      return res.json([
              { title: "Ajouter une vidéo", href: '/mediapiston/upload' }
                      ]);
    res.json([]);
  });

  router.get('/news/adminFeatures', (req, res) => {
    if (req.isAuthenticated() && req.user.admin)
      return res.json([
              { title: "Ajouter un élément", href: '/news/add' },
              { title: "Gérer les news", href: '/news/admin' }
                      ]);
    res.json([]);
  });

  router.get('/matos/adminFeatures', routes.loggedIn, (req, res) => {
    if (req.user.admin)
      return res.json([
              { title: "Ajouter un matériel", href: '/matos/add' },
              { title: "Gérer le matériel", href: '/matos/admin' }
                      ]);
    res.json([]);
  });

  return router;
}

module.exports = utilsRoutes;
