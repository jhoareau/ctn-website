let express = require('express'), session = require('express-session');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser'), helmet = require('helmet');
let passport = require('passport'), OAuth2Strategy = require('passport-oauth2').Strategy, LocalStrategy = require('passport-local').Strategy;
let request = require('superagent');

let app = express();
let config = require('./config.secrets.json');

/* Passport */

var Account_OAuth = require('./models/oauth_passport');
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
/*var Account = require('./models/local_passport');
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
  }, Account.authenticator));
passport.serializeUser(Account.serializeUser);
passport.deserializeUser(Account.deserializeUser);
const passportMiddleware = passport.authenticate('local', { failureRedirect: '/login' });*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true; //app.get('env') === 'development';

app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: config.session.secret, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
let publicRoutes = require('./routes/public')(passportMiddleware);
let restRoutes = require('./routes/rest');

app.use('/', publicRoutes);
app.use('/ajax', restRoutes);

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

let server = app.listen(app.get('port'), () => {
	console.log('Express server listening on port ' + server.address().port);
});
