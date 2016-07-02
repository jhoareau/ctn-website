import React from 'react';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <ul className="nav navbar-nav">{
          this.props.links.map((link) => {
            let active = window.location.pathname.indexOf(link.href) != -1;
            let className = active ? 'nav-link active' : 'nav-link';
            if (link.logout) className += " text-danger";
            return (<li className="nav-item" key={link.href}>
                      <a href={link.href} className={className}>{link.title}</a>
                    </li>);
          })
        }</ul>
    );
  }
}
Header.defaultProps = {
  links: [
          { title: "Mediapiston", href: '/mediapiston' },
          { title: "Matériel", href: '/pret-matos' },
          { title: "A propos", href: '/a-propos' },
          { title: "Admin", href: '/ctn-asso' },
          { title: "Déconnexion", href: '/logout', logout: true },
         ]
};

export default Header;
