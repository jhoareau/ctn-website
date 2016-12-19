let SocketIOFileUpload = require('./socketio-fileupload'),
    socketio           = require('socket.io'),
    fs                 = require('fs'),
    path               = require('path'),
    mongodb            = require('../models/mongodb');

let handler = (winston, http) => {
  var io = socketio.listen(http);
  io.set('transports', ['websocket']);
  io.sockets.on('connection', socket => {
      var uploader = new SocketIOFileUpload();
      uploader.dir = path.join(__dirname, '../videos');
      uploader.listen(socket);

      uploader.on("complete", event => {
        if (event.interrupt)
          uploader.emit('error', "La transmission n'a pas fonctionné correctement.");
      });

      uploader.on("saved", event => {
          event.file.clientDetail.error = "";
          if (event.file.name.split('.').pop().toLowerCase() !== 'mp4')
      		{
      			uploader.emit('error', "Le type de fichier n'est pas correct.");
      			event.file.clientDetail.error = "Le type de fichier n'est pas correct.";
      			fs.unlink('videos/' + event.file.name, err => {});
            event.file.success = false;
      		}

          if (!event.file.success) {
            uploader.emit('error', "Le fichier n'a pas pu être sauvegardé sur le serveur.");
            event.file.clientDetail.error = "Le fichier n'a pas pu être sauvegardé sur le serveur.";
            uploader._emitComplete("siofu_complete", event.file.id, false);
            uploader.emit('complete', {
              file: event.file,
              interrupt: true
            });
            return;
          }

          mongodb.video.generateID(id => {
            event.file.clientDetail.fileName = id;
            fs.rename(event.file.pathName, path.join(__dirname, '..', '/videos/') + id + '.mp4', err => {
              if(err) {
                uploader.emit('error', "Le fichier n'a pas pu être renommé sur le serveur.");
                event.file.clientDetail.error = "Le fichier n'a pas pu être renommé sur le serveur.";
                event.file.success = false;
              }
              event.file.success = true;
              socket.emit("siofu_complete", {
          			id: event.file.id,
          			success: event.file.success,
          			detail: event.file.clientDetail
          		});
              uploader.emit('complete', {
                file: event.file,
                interrupt: !event.file.success
              });
            });
          });
      });

      uploader.on("error", event => {
          winston.log("warning", "SocketIO Video Upload / " + event.error.toString());
      });
  });

  return io;
};

module.exports = handler;
