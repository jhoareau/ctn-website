import React from 'react';
import Slider from 'react-slick';

class CarouselItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{backgroundImage: 'url(' + this.props.imageUrl + ')'}} className="carouselItem">
        {!this.props.thumb ? <div className="carouselText">
                              <h3>{this.props.title}</h3>
                              <p>{this.props.description}</p>
                            </div>
         : null}
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

class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = props;
  }

  render() {
    const settings = {
      customPaging: i => (
        <a><CarouselItem {...this.state.carouselList[i]} thumb={true} key={'thumb' + i} /></a>
      ),
      dots: true,
      dotsClass: 'slick-dots slick-thumb',
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <div className="carouselContainer">
        <Slider {...settings}>
          {this.state.carouselList.map((el, i) => <div key={'item'+i}><CarouselItem {...el} /></div>)}
        </Slider>
      </div>
    )
  }
}

Carousel.defaultProps = {
  carouselList: [
    {}, {title: "Titre Carousel 2"}, {title: "Titre Carousel 3"}, {title: "Titre Carousel 4"}
  ]
};

export default Carousel;
