/*
** express.js : entry point for the web server application
** Mediapiston-React, 2016
** Sulu, pour CTN
*/

/* Serveur HTTP */
const express = require('express'), sessionExpress = require('express-session');
const RedisStore = require('connect-redis')(sessionExpress);

/* Gestion des liens dans le système de fichiers, pour être portable sur toutes les plateformes */
const path = require('path');

/* Logging des requêtes HTTP */
const logger = require('morgan');

/* Gestion des petits uploads (images, informations de formulaire) */
const bodyParser = require('body-parser');

/* Sécurités HTTP */
const helmet = require('helmet');

/* Gestion de l'authentification */
const passport = require('passport'), OAuth2Strategy = require('passport-oauth2').Strategy, LocalStrategy = require('passport-local').Strategy;

/* Récupération de la configuration (mots de passe) */
const config = require('../config.secrets.json');

/* Gestion des sessions persistantes */
const redis = config.session.redis || false;
const sessionParams = { secret: config.session.secret, resave: true, saveUninitialized: true };
if(redis) sessionParams['store'] = new RedisStore();

let session = sessionExpress(sessionParams);

/* Création de l'application */
const app = express();

/* Authentification : définition du modèle Passport */
const Account_OAuth = require('../models/oauth_passport');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Au cas où le certificat du serveur OAuth n'est pas acceptable
passport.use(new OAuth2Strategy({
    authorizationURL: 'https://www.myecl.fr/oauth/v2/auth',
    tokenURL: 'https://www.myecl.fr/oauth/v2/token',
    clientID: config.oauth2.clientID,
    clientSecret: config.oauth2.clientSecret,
    callbackURL: config.oauth2.redirectURI
},
Account_OAuth.authenticator));
passport.serializeUser(Account_OAuth.serializeUser);
passport.deserializeUser(Account_OAuth.deserializeUser);
const passportMiddleware = passport.authenticate('oauth2', { failureRedirect: '/login' });

/* Gestion des pages web */
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');
app.locals.pretty = true; //app.get('env') === 'development';

/* Logging des requêtes HTTP */
app.use(logger('dev'));

/* Sécurités HTTP */
app.use(helmet());

/* Gestion des petits uploads (images, informations de formulaire) */
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(session);

app.use(passport.initialize());

const passportSessionMiddleware = passport.session();
app.use(passportSessionMiddleware);

const appWithErrorLogger = (winston) => {
    /* Routes séparées de l'application */
    app.use(express.static(path.join(__dirname, '../public')));
    let publicRoutes = require('../routes/public')(passportMiddleware);
    let restRoutes = require('../routes/rest');
    let videoRouter = require('../routes/videos');
    let assetsRouter = require('../routes/assets');

    app.use('/', publicRoutes);
    app.use('/ajax', restRoutes.utils(winston));
    app.use('/ajax/news', restRoutes.news(winston));
    app.use('/ajax/items', restRoutes.item(winston));
    app.use('/ajax/videos', restRoutes.video(winston));
    app.use('/videos', videoRouter);
    app.use('/materiel', assetsRouter);

    // Page non existante
    app.use((req, res) => {
        res.status(404);
        res.render('error', {
            message: 'Page non trouvée !',
            error: {}
        });
    });

    // Gestion des erreurs serveur

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use((err, req, res) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use((err, req, res) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    app.set('port', config.express.port);

    return app;
}

module.exports = {app: appWithErrorLogger, session: {passport: passportSessionMiddleware, express: session}};
