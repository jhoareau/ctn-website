import React from 'react';
import Request from 'superagent';
import InlineSVG from 'svg-inline-react';
import CustomLink from './custom-link.jsx';

class Header extends React.Component {
  constructor(props) {
    super(props);
    let urlArray = ['admin', 'apropos', 'mediapiston', 'pret'];

    this.svgMap = new Map();
    urlArray.forEach(url => {
      this.svgMap.set(url, <InlineSVG className={'navbarSvg svg_' + url} src={require('svg-inline!~/public/defaults/' + url + '.svg')} />);
    });

    this.componentDidUpdate = this.componentDidMount;
    this.populate = this.populate.bind(this);

    this.state = props;

    if (typeof props.route !== 'undefined') this.populate(props.route);
  }
  populate(route) {
    Request.get(route).end((err, data) => {
      data = data.body;
      this.setState({links: data});
    });
  }

  render() {
    return (
        <ul className="nav navbar-nav">{
          this.state.links.map((link) => {
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
                        <CustomLink href={link.href} className={className} root={this.props.root}>
                          {svgContent}
                        </CustomLink>
                      </li>);
            }
          })
        }</ul>
    );
  }
  bindAnimateMediapiston(TweenMax) {
    let mpSvg = document.querySelector('.svg_mediapiston svg');
    let mpSvgCameraColor = document.querySelectorAll('.svg_mediapiston svg #Camera *');
    let mpSvgFilm = document.querySelector('.svg_mediapiston svg #CameraLens');
    mpSvg.addEventListener('mouseenter', () => {
      TweenMax.to(mpSvgCameraColor, 1, {
        css: {
          fill: '#88B04B',
        },
        ease: TweenMax.Power3.easeOut
      });
      TweenMax.to(mpSvgFilm, 1, {
        css: {
          scale: 2,
          transformOrigin: "50% 50%",
        },
        ease: TweenMax.Power3.easeOut
      });
    });
    mpSvg.addEventListener('mouseleave', () => {
      TweenMax.to(mpSvgCameraColor, 1, {
        css: {
          fill: '#888',
        },
        ease: TweenMax.Power3.easeOut
      });
      TweenMax.to(mpSvgFilm, 1, {
        css: {
          scale: 1,
          transformOrigin: "50% 50%",
        },
        ease: TweenMax.Power3.easeOut
      });
    });
  }
  bindAnimatePret(TweenMax) {
    let pretSvg = document.querySelector('.svg_pret svg');
    let pretSvgCardColor = document.querySelector('.svg_pret svg #SD_card');
    let pretSvgCard = document.querySelector('.svg_pret svg #SD_card');
    pretSvg.addEventListener('mouseenter', () => {
      TweenMax.to(pretSvgCardColor, 1, {
        css: {
          fill: '#7D7098',
        },
        ease: TweenMax.Power3.easeOut
      });

      TweenMax.to(pretSvgCard, 1, {
        css: {
          rotation: 20,
          transformOrigin: "50% 50%",
        },
        ease: TweenMax.Back.easeOut.config(5)
      });

    });
    pretSvg.addEventListener('mouseleave', () => {
      TweenMax.to(pretSvgCardColor, 1, {
        css: {
          fill: '#888',
        },
        ease: TweenMax.Power3.easeOut
      });
      TweenMax.to(pretSvgCard, 1, {
        css: {
          rotation: 0,
          transformOrigin: "50% 50%",
        },
        ease: TweenMax.Back.easeOut.config(5)
      });
    });
  }
  bindAnimateAdmin(TweenMax) {
    let adminSvg = document.querySelector('.svg_admin svg');
    let adminSvgKeyColor = document.querySelector('.svg_admin svg #Key');
    let adminSvgKey = document.querySelector('.svg_admin svg #Key');
    adminSvg.addEventListener('mouseenter', () => {
      TweenMax.to(adminSvgKeyColor, 1, {
        css: {
          fill: '#B2E79F',
        },
        ease: TweenMax.Power3.easeOut
      });
      TweenMax.to(adminSvgKey, 1, {
        css: {
          rotation: -45,
          transformOrigin: "left 50%",
        },
        ease: TweenMax.Power3.easeOut
      });
    });
    adminSvg.addEventListener('mouseleave', () => {
      TweenMax.to(adminSvgKeyColor, 1, {
        css: {
          fill: '#888',
        },
        ease: TweenMax.Power3.easeOut
      });
      TweenMax.to(adminSvgKey, 1, {
        css: {
          rotation: 0,
          transformOrigin: "left 50%",
        },
        ease: TweenMax.Power3.easeOut
      });
    });
  }
  bindAnimateApropos(TweenMax) {
    let aproposSvg = document.querySelector('.svg_apropos svg');
    let aproposRotatorColor = document.querySelectorAll('.svg_apropos svg #Aperture *');
    let aproposRotator = document.querySelector('.svg_apropos svg #Aperture');
    aproposSvg.addEventListener('mouseenter', () => {
      TweenMax.to(aproposRotatorColor, 1, {
        css: {
          fill: '#EEA2A9',
        },
        ease: TweenMax.Power3.easeOut
      });
      TweenMax.to(aproposRotator, 1, {
        css: {
          rotation: 180,
          transformOrigin: "50% 50%",
        },
        ease: TweenMax.Power3.easeOut
      });
    });
    aproposSvg.addEventListener('mouseleave', () => {
      TweenMax.to(aproposRotatorColor, 1, {
        css: {
          fill: '#888',
        },
        ease: TweenMax.Power3.easeOut
      });
      TweenMax.to(aproposRotator, 1, {
        css: {
          rotation: 0,
          transformOrigin: "50% 50%",
        },
        ease: TweenMax.Power3.easeOut
      });
    });
  }
  componentDidMount() {
    let TweenMax = require('gsap');
    // Attach animation event handlers
    if (this.state.links.length > 2) {
      try {
        this.bindAnimatePret(TweenMax);
      } catch (e) {}
      try {
        this.bindAnimateMediapiston(TweenMax);
      } catch (e) {}
    }
    try {
      this.bindAnimateApropos(TweenMax);
    } catch (e) {}
    
    if (this.state.links.length === 5)
      try {
        this.bindAnimateAdmin(TweenMax);
      } catch (e) {}
  }
}
Header.defaultProps = {
  links: [
          { title: "Connexion", href: '/login', logout: true },
          { title: "Déconnexion", href: '/logout', logout: true },
         ]
};

export default Header;
