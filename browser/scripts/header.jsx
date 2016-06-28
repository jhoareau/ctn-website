import React from 'react';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <ul className="nav navbar-nav">{
          this.props.links.map((link) => {
            let className = link.active ? 'nav-link active' : 'nav-link';
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
          { title: "Mediapiston", href: '/mediapiston', active: false },
          { title: "Matériel", href: '/pret-matos', active: false },
          { title: "A propos", href: '/a-propos', active: false },
          { title: "Admin", href: '/ctn-asso', active: false },
          { title: "Déconnexion", href: '/logout', active: false, logout: true },
         ]
};

export default Header;
