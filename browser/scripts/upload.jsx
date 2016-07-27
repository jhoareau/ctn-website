import React from 'react';

class Upload extends React.Component {
  constructor(props) {
    super(props);
  }
  thumbFromVideoFile() {
    let file = document.getElementById('videoFile').files[0];
    let videoObject = document.createElement('video');
    videoObject.src = URL.createObjectURL(file) + '#t=20';

    setTimeout(() => {
      document.getElementById('canvasVideo').getContext('2d').drawImage(videoObject, 0, 0, videoObject.videoWidth, videoObject.videoHeight);
      document.getElementById('videoFileName').innerHTML = file.name;
    }, 1000);
  }
  thumbFromThumbnailFile() {
    let file = document.getElementById('thumbnailFile').files[0];
    let imageObject = document.createElement('img');
    imageObject.src = URL.createObjectURL(file);

    setTimeout(() => {
      document.getElementById('canvasImage').getContext('2d').drawImage(imageObject, 0, 0, imageObject.width, imageObject.height);
      document.getElementById('thumbnailFileName').innerHTML = file.name;
    }, 1000);
  }
  render() {
    return (
      <div className="upload-container">
        <div className="uploadBox">
          <input type="file" accept="video/mp4" id="videoFile" onChange={this.thumbFromVideoFile}/>
          <i className="material-icons">cloud_upload</i><br/>
          Vidéo<br/>
          <span id="videoFileName"/>
          <canvas id='canvasVideo' />
        </div>
        <div className="uploadBox">
          <input type="file" accept="image/*" id="thumbnailFile" onChange={this.thumbFromThumbnailFile}/>
          <i className="material-icons">cloud_upload</i><br/>
          Miniature<br/>
          <span id="thumbnailFileName"/>
          <canvas id='canvasImage' />
        </div>

      </div>
    );
  }
}
Upload.defaultProps = {
  initialVideo: [],
  initialThumb: []
};

export default Upload;
