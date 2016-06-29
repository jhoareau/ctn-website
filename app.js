let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let passport = require('passport'), OAuthStrategy = require('passport-oauth2').OAuthStrategy;

passport.use('provider', new OAuthStrategy({
    requestTokenURL: 'https://www.provider.com/oauth/request_token',
    accessTokenURL: 'https://www.provider.com/oauth/access_token',
    userAuthorizationURL: 'https://www.provider.com/oauth/authorize',
    consumerKey: '123-456-789',
    consumerSecret: 'shhh-its-a-secret',
    callbackURL: 'https://www.example.com/auth/provider/callback'
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate('', function(err, user) {
      done(err, user);
    });
  }
));

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true; //app.get('env') === 'development';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/mediapiston', (req, res) => {
  res.render('mediapiston_home');
});

app.get('/mediapiston/watch/:videoid', (req, res) => {
  res.render('mediapiston_video');
});

app.get('/pret-matos', (req, res) => {
  res.render('materiel');
});

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
