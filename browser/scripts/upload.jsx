import React from 'react';

class UploadSnippet extends React.Component {
  constructor(props) {
    super(props);
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

    setTimeout(() => {
      document.getElementById('canvasVideo').getContext('2d').drawImage(videoObject, 0, 0, videoObject.videoWidth, videoObject.videoHeight);
      document.getElementById('videoFileName').innerHTML = file.name;
      document.querySelector('.uploadBox button').style.display = 'inherit';
    }, 1000);
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

    let imageObject = document.createElement('img');
    imageObject.src = URL.createObjectURL(file);

    setTimeout(() => {
      canvas.getContext('2d').drawImage(imageObject, 0, 0, imageObject.width, imageObject.height);
      document.getElementById('thumbnailFileName').innerHTML = file.name;
    }, 1000);
  }
  render() {
    return (
      <div className="upload-container">
        <div className="uploadBox">
          <input className="coverBox" type="file" accept="video/mp4" id="videoFile" onChange={this.thumbFromVideoFile}/>
          <p>
            <i className="material-icons">cloud_upload</i><br/>
            Vidéo<br/>
            <span id="videoFileName"/>
          </p>
          <canvas id='canvasVideo' className="coverBox"/>
          <button className="btn btn-success">Envoyer</button>
        </div>
        <div className="uploadBox">
          <input className="coverBox" type="file" accept="image/*" id="thumbnailFile" onChange={this.thumbFromThumbnailFile}/>
          <p>
            <i className="material-icons">cloud_upload</i><br/>
            Miniature<br/>
            <span id="thumbnailFileName"/>
          </p>
          <canvas className="coverBox" id='canvasImage'/>
        </div>

      </div>
    );
  }
}
UploadSnippet.defaultProps = {
  initialVideo: [],
  initialThumb: []
};

class UploadForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="row">
        <form className="form-horizontal mdl-shadow--2dp col-md-6">
          <h6 className="mdl-typography--title formTitle">Détails de la vidéo</h6>
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label mainInput is-invalid is-upgraded">
            <label htmlFor="videoTitle" className="mdl-textfield__label">Titre de la vidéo</label>
            <input id="videoTitle" name="videoTitle" required="" className="mdl-textfield__input" type="text"/><span className="mdl-textfield__error">Titre requis !</span>
          </fieldset><br />
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-invalid is-upgraded">
            <label htmlFor="videoDesc" className="mdl-textfield__label">Description de la vidéo</label>
            <textarea id="videoDesc" name="videoDesc" required="" className="mdl-textfield__input"></textarea><span className="mdl-textfield__error">Description requise !</span>
          </fieldset>
          <fieldset className="form-group form-submit">
            <button type="submit" disabled="" className="mdl-button mdl-js-button mdl-button--raised mdl-button--disabled">Upload</button>
          </fieldset>
        </form>
        <div className="col-md-6">
          <h6 className="mdl-typography--title formTitle">Contenu</h6>
          <UploadSnippet />
        </div>
      </div>
    );
  }
}

export default UploadForm;
