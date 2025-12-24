import React from "react";
import Slider from "react-slick";
import { Image } from "antd";
import { Link } from "react-router-dom";


const SliderComponets = ({ arrSlider }) => {
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
      {arrSlider.map((image, index) => {
        return (
          <div key={index}>
            <Link to="/products">
              <Image src={typeof image === "string" ? image : image?.src} alt="slider" preview={false} />
            </Link>
          </div>
        );
      })}
    </Slider>
  );
}

export default SliderComponets;