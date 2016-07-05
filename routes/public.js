let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = (passportMiddleware) => {
  router.use(passportMiddleware);
  router.post('/login',
      function (req, res) {
        res.redirect(req.session.redirectTo || '/')
        delete req.session.redirectTo;
  });

  return router;
};
