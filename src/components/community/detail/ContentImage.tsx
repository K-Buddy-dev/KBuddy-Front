import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

interface Image {
  id: number;
  type: string;
  name: string;
  url: string;
}

interface ContentImageProps {
  images: Image[];
  title: string;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
}

export const ContentImage = ({ images, title, currentSlide, setCurrentSlide }: ContentImageProps) => {
  return (
    <div className="relative mb-4">
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex + 1)}
        onSwiper={(swiper) => setCurrentSlide(swiper.activeIndex + 1)}
        className="relative"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id}>
            <img
              src={image.url}
              alt={`${title} - Image ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev absolute left-2 top-1/2 transform -translate-y-1/2 text-white z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div className="swiper-button-next absolute right-2 top-1/2 transform -translate-y-1/2 text-white z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {currentSlide}/{images.length}
          </div>
        )}
      </Swiper>
    </div>
  );
};
