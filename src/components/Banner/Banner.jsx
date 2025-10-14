import React from "react";
import { Carousel } from "antd";
import "./index.css";

const bannerList = [
  {
    id: 1,
    image: "/images/banner1.webp",
    alt: "Võ Lâm Truyền Kỳ 2.0",
  },
  {
    id: 2,
    image: "/images/banner2.webp",
    alt: "Tam Quốc Huyền Tướng VNG",
  },
  {
    id: 3,
    image: "/images/banner3.webp",
    alt: "Play Together VNG",
  },
  {
    id: 4,
    image: "/images/banner4.webp",
    alt: "Liên Minh Huyền Thoại",
  },
];

const Banner = () => {
  return (
    <div className="vng-banner">
      <Carousel
        autoplay
        dots={{ className: "vng-carousel-dots" }}
        effect="fade"
      >
        {bannerList.map((banner) => (
          <div key={banner.id} className="banner-slide">
            <img src={banner.image} alt={banner.alt} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
