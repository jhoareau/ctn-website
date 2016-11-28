import React from 'react';
import Request from 'superagent';

/// TODO: Bind state to component view for Pure Immutability
class UploadSnippet extends React.Component {
  constructor(props) {
    super(props);

    this.uploadVideoFile = this.uploadVideoFile.bind(this);
    this.thumbFromVideoFile = this.thumbFromVideoFile.bind(this);
    this.thumbFromThumbnailFile = this.thumbFromThumbnailFile.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  thumbFromVideoFile() {
    let file = document.getElementById('videoFile').files[0];
    let canvas = document.getElementById('canvasVideo');

    if (file.name.split('.').pop().toLowerCase() !== 'mp4') {
      document.getElementById('videoFile').value = '';
      document.getElementById('videoFileName').innerHTML = '';
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      return false;
    }

    let videoObject = document.createElement('video');
    videoObject.src = URL.createObjectURL(file) + '#t=20';
    videoObject.load();
    
    videoObject.addEventListener('loadeddata', () => {
      canvas.width = videoObject.videoWidth;
      canvas.height = videoObject.videoHeight;
      document.getElementById('canvasVideo').getContext('2d').drawImage(videoObject, 0, 0, videoObject.videoWidth, videoObject.videoHeight);
      document.getElementById('videoFileName').innerHTML = file.name;
      document.querySelector('.uploadBox button').style.display = 'inherit';
    });
  }
  thumbFromThumbnailFile() {
    let file = document.getElementById('thumbnailFile').files[0];
    let canvas = document.getElementById('canvasImage');

    if (['png', 'jpg', 'bmp', 'jpeg', 'gif'].indexOf(file.name.split('.').pop().toLowerCase()) < 0) {
      document.getElementById('thumbnailFile').value = '';
      document.getElementById('thumbnailFileName').innerHTML = '';
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      return false;
    }

    let imageObject = new Image();
    imageObject.src = URL.createObjectURL(file);

    imageObject.onload = () => {
      canvas.width = imageObject.width;
      canvas.height = imageObject.height;
      canvas.getContext('2d').drawImage(imageObject, 0, 0, imageObject.width, imageObject.height);
      document.getElementById('thumbnailFileName').innerHTML = file.name;
    };
  }
  uploadVideoFile() {
    let io = require('socket.io-client');
    //let ioFileUpload = require('~/browser/scripts/siofu_client');
    let ioFileUpload = require('socketio-file-upload/client');
    document.getElementById('uploadProgress').style.display = 'block';
    let socket = io.connect({transports: ['websocket'], upgrade: false});

    let fileUploadSocket = new ioFileUpload(socket);
    let fileToUpload = document.getElementById('videoFile').files;

    fileUploadSocket.addEventListener('progress', event => {
      let percent = event.bytesLoaded / event.file.size * 100;
      document.getElementById('uploadProgress').MaterialProgress.setProgress(percent);
    });

    fileUploadSocket.addEventListener('complete', event => {
      console.log(event);
      if (event.success && event.detail.error == "") {
        document.getElementById('uploadProgress').style.display = 'none';
        document.querySelector('.uploadBox button').style.display = 'none';
        document.getElementById('videoFile').style.display = 'none';
        document.getElementById('videoFileID').value = event.detail.fileName;
        this.props.onUploadFinished();
      }
      else {
        alert("Erreur d'envoi de la vidéo, veuillez réessayer - " + event.detail.error);
      }
    });
    fileUploadSocket.addEventListener('error', event => {
      document.getElementById('uploadProgress').classList.add('mdl-progress__indeterminate');
      alert("Erreur d'envoi de la vidéo, veuillez réessayer - " + event.error);
    });
    fileUploadSocket.submitFiles(fileToUpload);
  }
  render() {
    let videoFileUploadBox = null;
    if (!this.props.thumbOnly)
      videoFileUploadBox = (<div className="uploadBox">
                              <input className="coverBox" type="file" accept="video/mp4" id="videoFile" onChange={this.thumbFromVideoFile}/>
                              <input type="hidden" id="videoFileID" required="required" value="undefined"/>
                              <p>
                                <i className="material-icons">cloud_upload</i><br/>
                                Vidéo<br/>
                                <span className="boxTooltip">Sélectionner ou glisser-déposer</span><br/>
                                <span id="videoFileName"/>
                              </p>
                              <canvas id='canvasVideo' className="coverBox"/>
                              <button className="btn btn-success" onClick={this.uploadVideoFile}>Envoyer</button>
                              <div id="uploadProgress" className="mdl-progress mdl-js-progress"></div>
                            </div>);
    return (
      <div className="upload-container">
        {videoFileUploadBox}
        <div className="uploadBox">
          <input className="coverBox" type="file" accept="image/*" id="thumbnailFile" onChange={this.thumbFromThumbnailFile}/>
          <p>
            <i className="material-icons">cloud_upload</i><br/>
            Miniature<br/>
            <span className="boxTooltip">Sélectionner ou glisser-déposer</span><br/>
            <span id="thumbnailFileName"/>
          </p>
          <canvas className="coverBox" id='canvasImage'/>
        </div>

      </div>
    );
  }
  componentDidMount() {
    if (!this.props.thumbOnly) return;
      let canvas = document.getElementById('canvasImage');
      let imageObject = new Image();
      imageObject.onload = function() {
          canvas.width = imageObject.width;
          canvas.height = imageObject.height;
          canvas.getContext('2d').drawImage(imageObject, 0, 0, imageObject.width, imageObject.height);
      };
      imageObject.src = '/videos/' + this.props._id + '.png';
      this.props.onUploadFinished();
  }
}

class UploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.saveUpload = this.saveUpload.bind(this);
  }
  allowUpload() {
    document.querySelector('form button[type="submit"]').removeAttribute('disabled');
    document.querySelector('form button[type="submit"]').classList.remove('mdl-button--disabled');
  }
  saveUpload(event) {
    event.preventDefault();
    let uploadData = {
      title: document.getElementById('videoTitle').value,
      description: document.getElementById('videoDesc').value
    };

    if (!this.props.update) uploadData._id = document.getElementById('videoFileID').value;

    // S'il n'y a pas de miniature, la générer à partir du canvasVideo
    if (document.getElementById('thumbnailFile').files.length === 0 && !this.props.update) {
      uploadData.thumbnail = document.getElementById('canvasVideo').toDataURL("image/png");
    }
    else {
      uploadData.thumbnail = document.getElementById('canvasImage').toDataURL("image/png");
    }

    if (this.props.update)
      Request.post('/ajax/video/' + this.props._id + '/update').send(uploadData).end((err, data) => {
        if (err) return console.log(err);
        window.location = '/mediapiston'
      });
    else
      Request.put('/ajax/video/add').send(uploadData).end((err, data) => {
        if (err) return console.log(err);
        window.location = '/mediapiston'
      });
  }
  render() {
    return (
      <div>
        <div>
          <h6 className="mdl-typography--title formTitle">Contenu</h6>
          <UploadSnippet thumbOnly={this.props.update} {...this.props} onUploadFinished={this.allowUpload}/>
        </div>
        <form className="form-horizontal mdl-shadow--2dp" onSubmit={this.saveUpload}>
          <h6 className="mdl-typography--title formTitle">Détails de la vidéo</h6>
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label mainInput">
            <label htmlFor="videoTitle" className="mdl-textfield__label">Titre de la vidéo</label>
            <input id="videoTitle" name="videoTitle" required="required" className="mdl-textfield__input" type="text" defaultValue={this.props.update ? this.props.title : ''} />
            <span className="mdl-textfield__error">Titre requis !</span>
          </fieldset><br />
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <label htmlFor="videoDesc" className="mdl-textfield__label">Description de la vidéo</label>
            <textarea id="videoDesc" name="videoDesc" required="required" className="mdl-textfield__input" defaultValue={this.props.update ? this.props.description : ''} />
            <span className="mdl-textfield__error">Description requise !</span>
          </fieldset>
          <fieldset className="form-group form-submit">
            <button type="submit" disabled="disabled" className="mdl-button mdl-js-button mdl-button--raised mdl-button--disabled">{this.props.update ? 'Modifier' : 'Ajouter'}</button>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default UploadForm;
