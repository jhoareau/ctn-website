/*
** app.js : entry point for the application
** Mediapiston-React, 2016
** Sulu, pour CTN
*/

/* Librairie Winston - Error logging & severity management */
const winston = require('winston')

/* Sous-application interne ExpressApp - Serveur HTTP */
const expressApp = require('./apps/express')(winston)
const httpServer = require('http').createServer(expressApp);

httpServer.listen(expressApp.get('port'), () => {
	winston.log('info', 'Express App / Launch / Port ' + httpServer.address().port);
});

/* Sous-application interne SocketIO - Serveur d'upload de gros fichiers */
const socketIO = require('./apps/socketio')(winston, httpServer);
