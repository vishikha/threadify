import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./FrontPage.css";

export default function FrontPage() {
  return (
    <div className="frontpage">

      <Swiper 
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="hero-slider"
      >

        {/* Slide 1 */}
        <SwiperSlide>
          <div className="slide slide1">
            <div className="overlay"></div>
            <div className="slide-content">
              <h1>Upgrade Your Style</h1>
              <p>Discover the latest fashion trends</p>
              
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="slide slide2">
            <div className="overlay"></div>
            <div className="slide-content">
              <h1>New Collection</h1>
              <p>Fresh arrivals just for you</p>
              
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="slide slide3">
            <div className="overlay"></div>
            <div className="slide-content">
             
              
            </div>
          </div>
        </SwiperSlide>

      </Swiper>

    </div>
  );
}