"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";

const heroImages = [
  { imgUrl: '/assets/hero-1.svg', alt: 'smartwatch' },
  { imgUrl: '/assets/hero-2.svg', alt: 'bag' },
  { imgUrl: '/assets/hero-3.svg', alt: 'lamp' },
  { imgUrl: '/assets/hero-4.svg', alt: 'air fryer' },
  { imgUrl: '/assets/hero-5.svg', alt: 'chair' },
];

const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={2000}
        showArrows={false}
        showStatus={false}
      >
        {heroImages.map((image) => (
          <div key={image.alt}>
            <Image
              src={image.imgUrl}
              alt={image.alt}
              width={484}
              height={484}
              className="object-contain"
            />
          </div>
        ))}
      </Carousel>

      <div className="max-xl:hidden absolute -left-[15%] bottom-0 z-0">
        <Image
          src="/assets/hand-drawn-arrow.svg"
          alt="arrow"
          width={175}
          height={175}
        />
      </div>
    </div>
  );
}

export default HeroCarousel;



