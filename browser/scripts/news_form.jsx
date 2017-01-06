import React from 'react';
import Request from 'superagent';
import * as MaterialComponentHandler from 'exports?componentHandler&MaterialRipple!material-design-lite/material'; // Google material-design-lite V1 workaround


class NewsForm extends React.Component {
  constructor(props) {
    super(props);

    this.saveUpload = this.saveUpload.bind(this);
    this.populate = this.populate.bind(this);
    this.imageFromUpload = this.imageFromUpload.bind(this);
    this.updateNewsTitle = this.updateNewsTitle.bind(this);
    this.updateNewsLink = this.updateNewsLink.bind(this);
    this.updateNewsDescription = this.updateNewsDescription.bind(this);

    this.state = Object.assign({newsTitle: '', newsLink: '', newsDescription: '', submitDisabled: true}, props);

    if (typeof props.route !== 'undefined' && this.props.update) this.populate(props.route);
  }

  populate(route) {
    Request.get(route).end((err, data) => {
      data = data.body;
      this.setState({newsTitle: data.title, newsLink: data.href, newsDescription: data.description});
    });
  }
  
  componentDidMount() {
    MaterialComponentHandler.componentHandler.upgradeDom();
  }

  componentDidUpdate() {
    // Forcing Material-Design-Lite component update
    this.refs.newsTitle.dispatchEvent(new Event('input'));
    this.refs.newsDesc.dispatchEvent(new Event('input'));
  }

  updateNewsTitle(event) {
    event.target.required = true; // Workaround MDL marking the field as invalid
    this.setState({newsTitle: event.target.value});
  }

  updateNewsLink(event) {
    this.setState({newsLink: event.target.value});
  }

  updateNewsDescription(event) {
    event.target.required = true; // Workaround MDL marking the field as invalid
    this.setState({newsDescription: event.target.value});
  }

  imageFromUpload() {
    let file = this.refs.imageFile.files[0];
    let canvas = this.refs.canvasImage;

    if (['png', 'jpg', 'bmp', 'jpeg', 'gif'].indexOf(file.name.split('.').pop().toLowerCase()) < 0) {
      this.refs.imageFile.value = '';
      this.refs.imageFilename.innerHTML = '';
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      return false;
    }

    let imageObject = new Image();
    imageObject.src = URL.createObjectURL(file);

    imageObject.onload = () => {
      // Vérifications taille image
      if (Math.abs(imageObject.width / imageObject.height - 16/9) > 0.1) {
        this.refs.imageFile.value = '';
        this.refs.imageFilename.innerHTML = '';
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        alert("Ratio d'image incorrect !");
        return false;
      }
      if (imageObject.width < 1600) {
        this.refs.imageFile.value = '';
        this.refs.imageFilename.innerHTML = '';
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        alert("Image trop petite, elle sera floue !");
        return false;
      }

      canvas.width = imageObject.width;
      canvas.height = imageObject.height;
      canvas.getContext('2d').drawImage(imageObject, 0, 0, imageObject.width, imageObject.height);
      this.refs.imageFilename.innerHTML = file.name;
      this.setState({submitDisabled: false});
    };
  }

  saveUpload(event) {
    event.preventDefault();

    let uploadData = {
      title: this.state.newsTitle,
      description: this.state.newsDescription
    };

    if (this.state.newsTitle)
      uploadData.href = this.state.newsTitle;

    uploadData.thumbnail = this.refs.canvasImage.toDataURL("image/png");

    if (this.props.update)
      Request.post('/ajax/news/' + this.props._id + '/update').send(uploadData).end((err, data) => {
        if (err) return console.log(err);
        window.history.back();
      });
    else
      Request.put('/ajax/news/add').send(uploadData).end((err, data) => {
        if (err) return console.log(err);
        window.history.back();
      });
  }
  render() {
    return (
      <div>
        <div>
          <h6 className="mdl-typography--title formTitle">Image de couverture</h6>
          <div className="upload-container">
            <div className="uploadBox">
              <input className="coverBox" type="file" accept="image/*" ref="imageFile" onChange={this.imageFromUpload}/>
              <p>
                <i className="material-icons">cloud_upload</i><br/>
                Image <b>au format 16:9 !</b><br/>
                <span className="boxTooltip">Sélectionner ou glisser-déposer</span><br/>
                <span ref="imageFilename"/>
              </p>
              <canvas ref="canvasImage" className="coverBox"/>
            </div>
          </div>
          <p style={{textAlign: 'center'}}>L'image doit avoir une largeur d'au moins 1600px afin d'apparaître correctement sur la plupart des écrans.<br />
          Le ratio 16:9 permet un affichage optimal sur tous les écrans.</p>
        </div>
        <form className="form-horizontal mdl-shadow--2dp" onSubmit={this.saveUpload}>
          <h6 className="mdl-typography--title formTitle">Contenu de la carte</h6>
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label mainInput">
            <label htmlFor="newsTitle" className="mdl-textfield__label">Titre</label>
            <input ref="newsTitle" id="newsTitle" className="mdl-textfield__input" type="text" value={this.state.newsTitle} onChange={this.updateNewsTitle} />
            <span className="mdl-textfield__error">Titre requis !</span>
          </fieldset><br />
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label mainInput">
            <label htmlFor="newsLink" className="mdl-textfield__label">Lien (facultatif)</label>
            <input ref="newsLink" id="newsLink" className="mdl-textfield__input" type="url" value={this.state.newsLink} onChange={this.updateNewsLink} />
            <span className="mdl-textfield__error">Format incorrect !</span>
          </fieldset><br />
          <fieldset className="form-group mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <label htmlFor="newsDesc" className="mdl-textfield__label">Description</label>
            <textarea ref="newsDesc" id="newsDesc" className="mdl-textfield__input" value={this.state.videoDescription} onChange={this.updateNewsDescription} />
            <span className="mdl-textfield__error">Description requise !</span>
          </fieldset>
          <fieldset className="form-group form-submit">
            <button type="submit" ref="submitButton" disabled={this.state.submitDisabled} className={"mdl-button mdl-js-button mdl-button--raised" + (this.state.submitDisabled ? ' mdl-button--disabled' : '')}>{this.props.update ? 'Editer' : 'Poster'}</button>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default NewsForm;
