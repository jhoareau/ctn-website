import React from 'react';
import InlineSVG from 'svg-inline-react';

class Header extends React.Component {
  constructor(props) {
    super(props);
    //let urlArray = ['admin', 'apropos', 'ctn', 'mediapiston', 'pret'];
    let urlArray = ['mediapiston'];
    this.svgMap = new Map();
    urlArray.forEach(url => {
      this.svgMap.set(url, <InlineSVG className={'navbarSvg svg_' + url} src={require('svg-inline!~/public/defaults/' + url + '.svg')} />);
    });
    this.componentDidMount = this.componentDidMount.bind(this);
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
  bindAnimateMediapiston(TweenMax) {
    let mpSvg = document.querySelector('.svg_mediapiston svg');
    let mpSvgCameraColor = document.querySelectorAll('.svg_mediapiston svg #Calque_2 *');
    let mpSvgFilm = document.querySelector('.svg_mediapiston svg #Calque_2 *:nth-last-child(2)');
    mpSvg.addEventListener('mouseenter', () => {
      TweenMax.to(mpSvgCameraColor, 1, {
        css: {
          fill: '#43a047',
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
          fill: '#fff',
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
  /*bindAnimatePret(TweenMax) {
    let pretSvg = document.querySelector('.svg_pret svg');
    let pretSvgCardColor = document.querySelector('.svg_pret svg #Calque_2 *:first-child');
    let pretSvgCard = document.querySelector('.svg_pret svg #Calque_2');
    pretSvg.addEventListener('mouseenter', () => {
      TweenMax.CSSPlugin.useSVGTransformAttr = false; // 3D SVG Transforms for animatePret
      TweenMax.to(pretSvgCardColor, 1, {
        css: {
          fill: 'rgb(204, 214, 90)',
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
          fill: '#fff',
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
    let adminSvgKeyColor = document.querySelector('.svg_admin svg #Calque_2 *:first-child');
    let adminSvgKey = document.querySelector('.svg_admin svg #Calque_2');
    adminSvg.addEventListener('mouseenter', () => {
      TweenMax.to(adminSvgKeyColor, 1, {
        css: {
          fill: 'rgb(204, 214, 90)',
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
          fill: '#fff',
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
    let aproposRotatorColor = document.querySelectorAll('.svg_apropos svg #Calque_2 *');
    let aproposRotator = document.querySelector('.svg_apropos svg #Calque_2');
    aproposSvg.addEventListener('mouseenter', () => {
      TweenMax.to(aproposRotatorColor, 1, {
        css: {
          fill: 'rgb(204, 214, 90)',
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
          fill: '#fff',
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
  }*/
  componentDidMount() {
    let TweenMax = require('gsap');
    // Attach animation event handlers
    //if (this.props.links.length > 2) {
      //this.bindAnimatePret(TweenMax);
      this.bindAnimateMediapiston(TweenMax);
    //}
    //this.bindAnimateApropos(TweenMax);
    //if (this.props.links.length === 5) this.bindAnimateAdmin(TweenMax);
  }
}
Header.defaultProps = {
  links: [
          { title: "Mediapiston", href: '/mediapiston' },
          { title: "Matériel", href: '/pret-matos' },
          { title: "A propos", href: '/a-propos' },
          { title: "Déconnexion", href: '/logout', logout: true },
         ]
};

export default Header;
