import React from 'react';

class Upload extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <i className="material-icons">cloud_upload</i>
    );
  }
}
Upload.defaultProps = {
  links: [
          { title: "Mediapiston", href: '/mediapiston' },
          { title: "Matériel", href: '/pret-matos' },
          { title: "A propos", href: '/a-propos' },
          { title: "Admin", href: '/ctn-asso' },
          { title: "Déconnexion", href: '/logout', logout: true },
         ]
};

export default Upload;
