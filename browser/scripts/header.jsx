import React from 'react';
import InlineSVG from 'svg-inline-react';

class Header extends React.Component {
  constructor(props) {
    super(props);
    let urlArray = ['admin', 'apropos', 'ctn', 'mediapiston', 'pret'];
    this.svgMap = new Map();
    urlArray.forEach(url => {
      this.svgMap.set(url, <InlineSVG className="navbarSvg" src={require('svg-inline!~/public/defaults/' + url + '.svg')} />);
    });
  }
  render() {
    return (
        <ul className="nav navbar-nav">{
          this.props.links.map((link) => {
            let active = window.location.pathname.indexOf(link.href) != -1;
            let className = active ? 'nav-link active' : 'nav-link';
            if (link.logout) className += " text-danger";
            if (typeof link.src === 'undefined')
              return (<li className="nav-item" key={link.href}>
                        <a href={link.href} className={className + ' textLink'}>{link.title}</a>
                      </li>);
            else {
              let svgContent = this.svgMap.get(link.src);
              return (<li className="nav-item" key={link.href}>
                        <a href={link.href} className={className}>
                          {svgContent}
                        </a>
                      </li>);
            }
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
