/*
** app.js : entry point for the application
** Mediapiston-React, 2016
** Sulu, pour CTN
*/

/* Librairie Winston - Error logging & severity management */
const winstonLib = require('winston');

const tsFormat = () => (new Date()).toLocaleTimeString();

const winston = new (winstonLib.Logger)({
  levels: winstonLib.config.syslog.levels,
  transports: [
    // colorize the output to the console
    new (winstonLib.transports.Console)({
		//Si on veut rediriger les logs vers un fichier :
		//new (winstonLib.transports.File)({
			//filename: './ctnwebsite.log',
      timestamp: tsFormat,
      colorize: true
    })
  ]
});

/* Sous-application interne ExpressApp - Serveur HTTP */
const expressApp = require('./apps/express')(winston)
const httpServer = require('http').createServer(expressApp);

httpServer.listen(expressApp.get('port'), () => {
	winston.log('info', 'Express App / Launch / Port ' + httpServer.address().port);
});

/* Sous-application interne SocketIO - Serveur d'upload de gros fichiers */
const socketIO = require('./apps/socketio')(winston, httpServer);
