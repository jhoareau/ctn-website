import React from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';

class CarouselItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{backgroundImage: this.props.imageUrl}} className="carouselItem">
        <div className="carouselText">
          <h3>{this.props.title}</h3>
          <p>{this.props.description}</p>
        </div>
      </div>
    );
  }
}
CarouselItem.defaultProps = {
  title: "Titre Carousel",
  description: "Description news",
  imageUrl: '/defaults/no_video.png',
  linkUrl: '/news/0'
};

class CarouselThumb extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{backgroundImage: this.props.imageUrl}} className="carouselItem">
        <div className="carouselText">
          <h3>{this.props.title}</h3>
          <p>{this.props.description}</p>
        </div>
      </div>
    );
  }
}
CarouselThumb.defaultProps = {
  title: "Titre Carousel",
  imageUrl: '/defaults/no_video.png',
  linkUrl: '/news/0'
};

class Carousel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="carousel">
        <div className="carouselContainer">
          {
            this.props.carouselList.map(item => {
              return <CarouselItem {...item} key={JSON.stringify(item)} />
            })
          }
        </div>
        <div className="carouselNavigator">
          {
            this.props.carouselList.map(item => {
              return <CarouselThumb {...item} key={JSON.stringify(item)} />
            })
          }
        </div>
      </div>
    );
  }
}
