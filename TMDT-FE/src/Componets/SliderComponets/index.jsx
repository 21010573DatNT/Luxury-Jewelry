import React from "react";
import Slider from "react-slick";
import {Image} from "antd";


const SliderComponets = ({arrSlider}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <Slider {...settings}>
      {arrSlider.map((image,index) => {
        return (
          <div key={index}>
            <Image src={image} alt="slider" preview={false}/>
          </div>
        );
      })}
    </Slider>
  );
}

export default SliderComponets;