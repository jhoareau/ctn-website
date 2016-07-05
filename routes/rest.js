let express = require('express');
let router = express.Router();

// Routes REST
router.get('/header', (req, res) => {
  if (!req.isAuthenticated())
    return res.json([ { title: "Connexion", href: '/login' }, { title: "A propos", href: '/a-propos' } ]);
  if (req.user.admin)
    return res.json([
            { title: "Mediapiston", href: '/mediapiston' },
            { title: "Matériel", href: '/pret-matos' },
            { title: "A propos", href: '/a-propos' },
            { title: "Admin", href: '/ctn-asso' },
            { title: "Déconnexion", href: '/logout', logout: true },
           ]);
  res.json([
          { title: "Mediapiston", href: '/mediapiston' },
          { title: "Matériel", href: '/pret-matos' },
          { title: "A propos", href: '/a-propos' },
          { title: "Déconnexion", href: '/logout', logout: true },
        ]);
});

module.exports = router;
