let express = require('express'), session = require('express-session');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser'), helmet = require('helmet');
let passport = require('passport'), OAuth2Strategy = require('passport-oauth2').Strategy, LocalStrategy = require('passport-local').Strategy;

let app = express();
let config = require('../config.secrets.json');

/* Passport */
var Account_OAuth = require('../models/oauth_passport');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Désolé...
passport.use(new OAuth2Strategy({
    authorizationURL: 'https://www.myecl.fr/oauth/v2/auth',
    tokenURL: 'https://www.myecl.fr/oauth/v2/token',
    clientID: config.oauth2.clientID,
    clientSecret: config.oauth2.clientSecret,
    callbackURL: "http://localhost/login/callback"
  },
  Account_OAuth.authenticator));
passport.serializeUser(Account_OAuth.serializeUser);
passport.deserializeUser(Account_OAuth.deserializeUser);
const passportMiddleware = passport.authenticate('oauth2', { failureRedirect: '/login' });

/* Express view engine */
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');
app.locals.pretty = true; //app.get('env') === 'development';

/* Express logging */
app.use(logger('dev'));

/* Express security */
app.use(helmet());

/* Express forms management */
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

/* Express session management */
app.use(session({ secret: config.session.secret, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

/* Express routes (front-end pages) */
app.use(express.static(path.join(__dirname, '../public')));
let publicRoutes = require('../routes/public')(passportMiddleware);
let restRoutes = require('../routes/rest');
let videoRouter = require('../routes/videos');
let assetsRouter = require('../routes/assets');

app.use('/', publicRoutes);
app.use('/ajax', restRoutes);
app.use('/videos', videoRouter);
app.use('/materiel', assetsRouter);

// 404
app.use((req, res) => {
    res.status(404);
    res.render('error', {
        message: 'Page non trouvée !',
        error: {}
    });
});

// error handlers

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

app.set('port', process.env.PORT || 80);

module.exports = app;
