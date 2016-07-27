import React from 'react';

class Upload extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="upload-container">
        <div className="uploadBox">
          <i className="material-icons">cloud_upload</i><br/>
          Vidéo
        </div>
        <div className="uploadBox">
          <i className="material-icons">cloud_upload</i><br/>
          Miniature
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
