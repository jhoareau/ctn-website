let expressApp = require('./apps/express')
let httpServer = require('http').createServer(expressApp);

httpServer.listen(expressApp.get('port'), () => {
	console.log('Express server listening on port ' + httpServer.address().port);
});

let socketIO = require('./apps/socketio')(httpServer);
