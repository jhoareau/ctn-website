import React from 'react';
import $ from 'jquery';

/// TODO: Bind state to component view for Pure Immutability
class UploadSnippet extends React.Component {
  constructor(props) {
    super(props);

    this.thumbFromThumbnailFile = this.thumbFromThumbnailFile.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
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
      this.props.onUploadFinished();
    };
  }

  render() {
    return (
      <div className="upload-container">
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
  componentDidMount() {
      if (!this.props.update) return;
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

class AddMatosForm extends React.Component {
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
      name: document.getElementById('matosName').value,
      description: document.getElementById('matosDesc').value,
      extes: document.getElementById('matosExte').checked,
      caution: document.getElementById('matosCaution').value
    };

    uploadData.thumbnail = document.getElementById('canvasImage').toDataURL("image/png");

    if (this.props.update)
      $.ajax({
        url: '/ajax/pret-matos/' + this.props._id + '/update', method: "POST",
        data: uploadData
      }).done(() => window.location = '/pret-matos/admin').fail((err) => console.log(err));
    else
      $.ajax({
        url: '/ajax/pret-matos/add', method: "PUT",
        data: uploadData
      }).done(() => window.location = '/pret-matos/admin').fail((err) => console.log(err));
  }
  render() {
    return (
      <div className="row">
        <form className="form-horizontal mdl-shadow--2dp col-md-6" onSubmit={this.saveUpload} style={{display: 'flex'}}>
          <div className="col-xs-6">
            <h6 className="mdl-typography--title formTitle">Détails du matériel</h6>
            <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label mainInput">
              <label htmlFor="matosName" className="mdl-textfield__label">Nom de l'objet</label>
              <input id="matosName" name="matosName" required="required" className="mdl-textfield__input" type="text" defaultValue={this.props.update ? this.props.title : ''} />
              <span className="mdl-textfield__error">Titre requis !</span>
            </fieldset><br />
            <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <label htmlFor="matosDesc" className="mdl-textfield__label">Description de l'objet</label>
              <textarea id="matosDesc" name="matosDesc" required="required" className="mdl-textfield__input" defaultValue={this.props.update ? this.props.description : ''} />
              <span className="mdl-textfield__error">Description requise !</span>
            </fieldset><br />
          </div>
          <div className="col-xs-6" style={{marginTop: '50px'}}>
            <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <label htmlFor="matosExte" className="mdl-textfield__label">Prêtable</label>
              <input id="matosExte" name="matosExte" className="mdl-textfield__input" type="checkbox" defaultChecked={this.props.update ? this.props.extes : true} />
            </fieldset><br />
            <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label mainInput">
              <label htmlFor="matosCaution" className="mdl-textfield__label">Caution</label>
              <input id="matosCaution" name="matosCaution" required="required" className="mdl-textfield__input" type="number" defaultValue={this.props.update ? this.props.caution : ''} />
              <span className="input__hint">€</span>
              <span className="mdl-textfield__error">Caution requise !</span>
            </fieldset>
            <fieldset className="form-group form-submit">
              <button type="submit" disabled="disabled" className="mdl-button mdl-js-button mdl-button--raised mdl-button--disabled">{this.props.update ? 'Modifier' : 'Ajouter'}</button>
            </fieldset>
          </div>
        </form>
        <div className="col-md-6">
          <h6 className="mdl-typography--title formTitle">Contenu</h6>
          <UploadSnippet thumbOnly={this.props.update} {...this.props} onUploadFinished={this.allowUpload}/>
        </div>
      </div>
    );
  }
}

export default AddMatosForm;
