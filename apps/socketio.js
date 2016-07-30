let SocketIOFileUpload = require('socketio-file-upload'),
    socketio           = require('socket.io'),
    fs                 = require('fs'),
    path               = require('path');

let handler = http => {
  var io = socketio.listen(http);
  io.sockets.on('connection', socket => {
      var uploader = new SocketIOFileUpload();
      uploader.dir = path.join(__dirname, '../videos');
      uploader.listen(socket);

      uploader.on("complete", event => {

      });

      uploader.on("saved", event => {
          event.file.clientDetail.error = "";
          if (event.file.name.split('.').pop().toLowerCase() !== 'mp4')
      		{
      			uploader.emit('error', "Le type de fichier n'est pas correct.");
      			event.file.clientDetail.error = "Le type de fichier n'est pas correct.";
      			fs.unlink('videos/' + event.file.name, err => {});
      		}

          if (!event.file.success)
          	uploader.emit('error', "Le fichier n'a pas pu être sauvegardé sur le serveur.");
      });

      uploader.on("error", event => {
          console.log("VideoSocketUpload", event.error);
      });
  });

  return io;
};

module.exports = handler;
