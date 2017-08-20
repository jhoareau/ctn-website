import React from 'react';
import Request from 'superagent';
import * as MaterialComponentHandler from 'exports?componentHandler&MaterialRipple!material-design-lite/material'; // Google material-design-lite V1 workaround

class UploadSnippet extends React.Component {
  constructor(props) {
    super(props);

    this.uploadVideoFile = this.uploadVideoFile.bind(this);
    this.thumbFromVideoFile = this.thumbFromVideoFile.bind(this);
    this.thumbFromThumbnailFile = this.thumbFromThumbnailFile.bind(this);
    this.injectThumbnailFromProps = this.injectThumbnailFromProps.bind(this);

    this.state = props;
  }

  injectThumbnailFromProps(props) {
    if (!props.thumbOnly) return;
    let canvas = this.refs.canvasImage;
    let imageObject = new Image();
    imageObject.onload = function() {
        canvas.width = imageObject.width;
        canvas.height = imageObject.height;
        canvas.getContext('2d').drawImage(imageObject, 0, 0, imageObject.width, imageObject.height);
    };
    imageObject.src = '/videos/' + props._id + '.png';
    props.onUploadFinished();
  }

  componentDidMount() {
    this.injectThumbnailFromProps(this.props);
  }

  thumbFromVideoFile() {
    let file = this.refs.videoFile.files[0];
    let canvas = this.refs.videoCanvas;

    if (file.name.split('.').pop().toLowerCase() !== 'mp4') {
      this.refs.videoFile.value = '';
      this.refs.videoFilename.innerHTML = '';
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      return false;
    }

    let videoObject = document.createElement('video');
    videoObject.src = URL.createObjectURL(file) + '#t=20';
    videoObject.load();

    videoObject.addEventListener('loadeddata', () => {
      canvas.width = videoObject.videoWidth;
      canvas.height = videoObject.videoHeight;
      canvas.getContext('2d').drawImage(videoObject, 0, 0, videoObject.videoWidth, videoObject.videoHeight);
      this.refs.videoFilename.innerHTML = file.name;
      this.refs.sendVideoButton.style.display = 'inherit';
    });
  }

  thumbFromThumbnailFile() {
    let file = this.refs.thumbnailFile.files[0];
    let canvas = this.refs.canvasImage;

    if (['png', 'jpg', 'bmp', 'jpeg', 'gif'].indexOf(file.name.split('.').pop().toLowerCase()) < 0) {
      this.refs.thumbnailFile.value = '';
      this.refs.thumbnailFilename.innerHTML = '';
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      return false;
    }

    let imageObject = new Image();
    imageObject.src = URL.createObjectURL(file);

    imageObject.onload = () => {
      canvas.width = imageObject.width;
      canvas.height = imageObject.height;
      canvas.getContext('2d').drawImage(imageObject, 0, 0, imageObject.width, imageObject.height);
      this.refs.thumbnailFilename.innerHTML = file.name;
    };
  }

  uploadVideoFile() {
    let io = require('socket.io-client');
    let ioFileUpload = require('socketio-file-upload/client');

    this.refs.uploadProgressBar.style.display = 'block';
    let socket = io.connect({transports: ['websocket'], upgrade: false});

    let fileUploadSocket = new ioFileUpload(socket);
    let fileToUpload = this.refs.videoFile.files;

    fileUploadSocket.addEventListener('progress', event => {
      let percent = event.bytesLoaded / event.file.size * 100;
      this.refs.uploadProgressBar.MaterialProgress.setProgress(percent);
    });

    fileUploadSocket.addEventListener('complete', event => {
      console.log(event);
      if (event.success && event.detail.error == "") {
        this.refs.uploadProgressBar.style.display = 'none';
        this.refs.sendVideoButton.style.display = 'none';
        this.refs.videoFile.style.display = 'none';
        this.setState({videoFileID: event.detail.fileName});
        this.props.onUploadFinished(this.state.videoFileID);
      }
      else {
        alert("Erreur d'envoi de la vidéo, veuillez réessayer (et/ou contacter ECLAIR) - " + event.detail.error);
      }
    });
    fileUploadSocket.addEventListener('error', event => {
      this.refs.uploadProgressBar.classList.add('mdl-progress__indeterminate');
      alert("Erreur d'envoi de la vidéo, veuillez réessayer - " + event.error);
    });
    fileUploadSocket.submitFiles(fileToUpload);
  }

  render() {
    let videoFileUploadBox = null;
    if (!this.props.thumbOnly)
      videoFileUploadBox = (<div className="uploadBox">
                              <input className="coverBox" type="file" accept="video/mp4" ref="videoFile" onChange={this.thumbFromVideoFile}/>
                              <p>
                                <i className="material-icons">cloud_upload</i><br/>
                                Vidéo<br/>
                                <span className="boxTooltip">Sélectionner ou glisser-déposer</span><br/>
                                <span ref="videoFilename"/>
                              </p>
                              <canvas ref='videoCanvas' className="coverBox"/>
                              <button ref="sendVideoButton" className="btn btn-success" onClick={this.uploadVideoFile}>Envoyer</button>
                              <div ref="uploadProgressBar" className="mdl-progress mdl-js-progress"></div>
                            </div>);
    return (
      <div className="upload-container">
        {videoFileUploadBox}
        <div className="uploadBox">
          <input className="coverBox" type="file" accept="image/*" ref="thumbnailFile" onChange={this.thumbFromThumbnailFile}/>
          <p>
            <i className="material-icons">cloud_upload</i><br/>
            Miniature<br/>
            <span className="boxTooltip">Sélectionner ou glisser-déposer</span><br/>
            <span ref="thumbnailFilename"/>
          </p>
          <canvas ref="canvasImage" className="coverBox"/>
        </div>

      </div>
    );
  }
}

export class UploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.saveUpload = this.saveUpload.bind(this);
    this.allowUpload = this.allowUpload.bind(this);
    this.populate = this.populate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = Object.assign({videoTitle: '', videoDescription: '', submitDisabled: true}, props);

    if (typeof props.route !== 'undefined' && this.props.update) this.populate(props.route);
  }

  populate(route) {
    Request.get(route).end((err, data) => {
      data = data.body;
      this.setState({videoTitle: data.title, videoDescription: data.description});
    });
  }

  componentDidMount() {
    MaterialComponentHandler.componentHandler.upgradeDom();
  }

  componentDidUpdate() {
    // Forcing Material-Design-Lite component update
    this.refs.videoTitle.dispatchEvent(new Event('input'));
    this.refs.videoDesc.dispatchEvent(new Event('input'));
  }

  handleInputChange(event) {
    event.target.required = true; // Workaround MDL marking the field as invalid
    this.setState({[event.target.id]: event.target.value});
  }

  allowUpload(videoFileID) {
    this.setState({submitDisabled: false});

    if (typeof videoFileID !== 'undefined') this.setState({videoFileID: videoFileID});
  }
  saveUpload(event) {
    event.preventDefault();
    if (typeof this.state.videoFileID === 'undefined' && !this.props.update) return alert('Vidéo non enregistrée sur le serveur !');
    let uploadData = {
      title: this.state.videoTitle,
      description: this.state.videoDescription
    };

    if (!this.props.update) uploadData._id = this.state.videoFileID;

    // S'il n'y a pas de miniature, la générer à partir du canvasVideo
    if (this.refs.uploadSnippet.refs.thumbnailFile.files.length === 0 && !this.props.update) {
      uploadData.thumbnail = this.refs.uploadSnippet.refs.videoCanvas.toDataURL("image/png");
    }
    else {
      uploadData.thumbnail = this.refs.uploadSnippet.refs.canvasImage.toDataURL("image/png");
    }

    if (this.props.update)
      Request.post('/ajax/videos/' + this.props._id).send(uploadData).end((err, data) => {
        if (err) return console.log(err);
        window.history.back();
      });
    else
      Request.put('/ajax/videos').send(uploadData).end((err, data) => {
        if (err) return console.log(err);
        window.history.back();
      });
  }
  render() {
    return (
      <div>
        <div>
          <h6 className="mdl-typography--title formTitle">Contenu</h6>
          <UploadSnippet ref="uploadSnippet" thumbOnly={this.props.update} {...this.state} onUploadFinished={this.allowUpload}/>
        </div>
        <form className="form-horizontal mdl-shadow--2dp" onSubmit={this.saveUpload}>
          <h6 className="mdl-typography--title formTitle">Détails de la vidéo</h6>
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label mainInput">
            <label htmlFor="videoTitle" className="mdl-textfield__label">Titre de la vidéo</label>
            <input ref="videoTitle" id="videoTitle" className="mdl-textfield__input" type="text" value={this.state.videoTitle} onChange={this.handleInputChange} />
            <span className="mdl-textfield__error">Titre requis !</span>
          </fieldset><br />
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <label htmlFor="videoDesc" className="mdl-textfield__label">Description de la vidéo</label>
            <textarea ref="videoDesc" id="videoDescription" className="mdl-textfield__input" value={this.state.videoDescription} onChange={this.handleInputChange} />
            <span className="mdl-textfield__error">Description requise !</span>
          </fieldset>
          <fieldset className="form-group form-submit">
            <button type="submit" ref="submitButton" disabled={this.state.submitDisabled} className={"mdl-button mdl-js-button mdl-button--raised" + (this.state.submitDisabled ? ' mdl-button--disabled' : '')}>{this.props.update ? 'Modifier' : 'Ajouter'}</button>
          </fieldset>
        </form>
      </div>
    );
  }
}

export class UploadMatosForm extends React.Component {
  constructor(props) {
    super(props);

    //this.saveUpload = this.saveUpload.bind(this);
    //this.allowUpload = this.allowUpload.bind(this);
    this.populate = this.populate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = Object.assign({itemName: '', itemDescription: '', itemDeposit: 0, itemPubliclyAvailable: true, submitDisabled: true}, props);

    if (typeof props.route !== 'undefined' && this.props.update) this.populate(props.route);
  }

  populate(route) {
    Request.get(route).end((err, data) => {
      data = data.body;
      this.setState({itemName: data.name, itemDeposit: data.deposit, itemDescription: data.description});
    });
  }

  componentDidMount() {
    //MaterialComponentHandler.componentHandler.upgradeDom();
  }

  componentDidUpdate() {
    // Forcing Material-Design-Lite component update
    this.refs.itemName.dispatchEvent(new Event('input'));
    this.refs.itemDesc.dispatchEvent(new Event('input'));
    this.refs.itemDeposit.dispatchEvent(new Event('input'));
  }

  handleInputChange(event) {
    event.target.required = true; // Workaround MDL marking the field as invalid
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({[event.target.id]: value});
  }

  render() {
    return (
      <div>
        <div>
          <h6 className="mdl-typography--title formTitle">Photo de l'objet</h6>
          <div className="upload-container">
            <div className="uploadBox">
              <input className="coverBox" type="file" accept="image/*" ref="thumbnailFile" onChange={this.thumbFromThumbnailFile}/>
              <p>
                <i className="material-icons">cloud_upload</i><br/>
                Image<br/>
                <span className="boxTooltip">Sélectionner ou glisser-déposer</span><br/>
                <span ref="thumbnailFilename"/>
              </p>
              <canvas ref="canvasImage" className="coverBox"/>
            </div>
          </div>
        </div>
        <form className="form-horizontal mdl-shadow--2dp" onSubmit={this.saveUpload}>
          <h6 className="mdl-typography--title formTitle">Détails du matériel</h6>
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label mainInput">
            <label htmlFor="itemName" className="mdl-textfield__label">Nom du matériel</label>
            <input ref="itemName" id="itemName" className="mdl-textfield__input" type="text" value={this.state.itemName} onChange={this.handleInputChange} />
            <span className="mdl-textfield__error">Nom requis !</span>
          </fieldset><br />
        <fieldset className="form-group full_width">
            <label htmlFor="itemPubliclyAvailable" className="switch_label">Disponible aux extés de CTN</label>
            <input ref="itemPubliclyAvailable" id="itemPubliclyAvailable" className="switch_input" type="checkbox" checked={this.state.itemPubliclyAvailable} onChange={this.handleInputChange} />
          </fieldset><br />
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label input_currency">
            <label htmlFor="itemDeposit" className="mdl-textfield__label">Caution</label>
            <input ref="itemDeposit" id="itemDeposit" className="mdl-textfield__input" type="number" value={this.state.itemDeposit} onChange={this.handleInputChange} />
            <span className="mdl-textfield__error">Caution requise ! (Doit être un nombre entier)</span>
          </fieldset><br />
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <label htmlFor="itemDesc" className="mdl-textfield__label">Description détaillée du matériel</label>
            <textarea ref="itemDesc" id="itemDescription" className="mdl-textfield__input" value={this.state.itemDescription} onChange={this.handleInputChange} />
            <span className="mdl-textfield__error">Description requise !</span>
          </fieldset>
          <fieldset className="form-group form-submit">
            <button type="submit" ref="submitButton" disabled={this.state.submitDisabled} className={"mdl-button mdl-js-button mdl-button--raised" + (this.state.submitDisabled ? ' mdl-button--disabled' : '')}>{this.props.update ? 'Modifier' : 'Ajouter'}</button>
          </fieldset>
        </form>
      </div>
    )
  }
}
