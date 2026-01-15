"use client";

import { sliderProps } from "@/utility/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

const AboutImageSlider = () => {
    return (
        <div className="about-image-slider-wrapper">
            <Swiper {...sliderProps.aboutSlider} className="swiper about-image-slider">
                <SwiperSlide>
                    <div className="about-image-item">
                        <img src="/assets/img/about/about-operations.png" alt="security-operations" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="about-image-item">
                        <img src="/assets/img/about/about-surveillance.png" alt="high-tech-surveillance" />
                    </div>
                </SwiperSlide>
            </Swiper>

            <style jsx global>{`
                .about-image-slider-wrapper {
                    position: relative;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .about-image-item img {
                    width: 100%;
                    height: 500px;
                    object-fit: cover;
                    border-radius: 20px;
                }
                @media (max-width: 767px) {
                    .about-image-item img {
                        height: 350px;
                    }
                }
            `}</style>
        </div>
    );
};

export default AboutImageSlider;
