import React from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';

class CarouselItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{backgroundImage: 'url(' + this.props.imageUrl + ')'}} className="carouselItem">
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
      <div style={{backgroundImage: 'url(' + this.props.imageUrl + ')'}} className="carouselThumb" onClick={this.props.clickHandler}>
        <div className="carouselText carouselThumbText">
          {this.props.title}
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

    this.state = {openedCarouselItem: 0};
  }

  openCarouselItem(index) {
    this.setState({openedCarouselItem: index});
    this.forceUpdate();
  }

  render() {
    let carouselIndex = this.state.openedCarouselItem;
    return (
      <div className="carousel">
        <div className="carouselContainer">
          <ReactCSSTransitionReplace transitionEnterTimeout={600} transitionLeaveTimeout={600} transitionName="carouselReplace">
            {
                <CarouselItem {...this.props.carouselList[carouselIndex]} key={carouselIndex} />
            }
          </ReactCSSTransitionReplace>
        </div>
        <div className="carouselNavigator">
          {
            this.props.carouselList.map((item, index) => {
              return <CarouselThumb {...item} key={index} clickHandler={this.openCarouselItem.bind(this, index)} />
            })
          }
        </div>
      </div>
    );
  }
}

Carousel.defaultProps = {
  carouselList: [
    {}, {title: "Titre Carousel 2"}, {title: "Titre Carousel 3"}, {title: "Titre Carousel 4"}
  ]
};

export default Carousel;
