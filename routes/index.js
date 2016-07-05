let models = require(__dirname + "/../models/")
let mediapiston = require(__dirname + "/mediapiston.js");
let matos = require(__dirname + "/matos.js");
let login = require(__dirname + "/user.js");
let admin = require(__dirname + "/admin.js");

const loggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    next();
  else {
    req.session.redirectTo = req.path;
    res.redirect('/login');
  }
}

exports.create = function (app) {

	mediapiston.createRoutes(app);
	matos.createRoutes(app);
	login.createRoutes(app);
	admin.createRoutes(app);
}

exports.loadUser = function(req, res, next) {
    if (req.param('token') || req.cookies.sessionToken)
    {
        database.user.getByToken(req.param('token') || req.cookies.sessionToken, function(user) {
            if (!user)
            {
                res.clearCookie("sessionToken");
                return res.send(418, {error: "Wrong token or session"}); // I'm a TEAPOOOOOOOOT ! :)
            }
            user.hasRight = function(rights) {
                if (!rights)
                    return true;
                for (var i = rights.length - 1; i >= 0; i--) {
                    if (!this.rights[rights[i]])
                        return false
                };
                return true;
            }
            req.userToken = req.param('token') || req.cookies.sessionToken;
            req.user = user;
            req.user.safeData = user.toObject();
            delete req.user.safeData.tokens;
            delete req.user.safeData.password;
            req.user.safeData.token = req.userToken;
            return next();
        });
    }
    else
        next();
}

exports.requireRights = function(rights) {
    return function(req, res, next) {
        if (!req.user)
            return res.send(401, {error: "Login required"});
        if (!req.user.hasRight(rights))
            return res.send(401, {error: "You don't have the rights to do this."});
        next();
    }
}
