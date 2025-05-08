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
  const isFirstSlide = currentSlide === 1;
  const isLastSlide = currentSlide === images.length;
  const prevArrowColor = isFirstSlide ? 'text-[#0A004B]/10' : 'text-black';
  const nextArrowColor = isLastSlide ? 'text-[#0A004B]/10' : 'text-black';

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          disabledClass: 'opacity-50 cursor-not-allowed',
        }}
        onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex + 1)}
        onSwiper={(swiper) => setCurrentSlide(swiper.activeIndex + 1)}
        className="relative"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id}>
            <img src={image.url} alt={`${title} - Image ${index + 1}`} className="w-full h-auto object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 && (
        <div className="flex justify-center items-center mt-2">
          <div className={`swiper-button-prev ${prevArrowColor} cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M14.5 7L9.5 12L14.5 17Z" />
            </svg>
          </div>
          <div className="font-roboto text-text-default text-xs font-medium">
            {currentSlide}/{images.length}
          </div>
          <div className={`swiper-button-next ${nextArrowColor} cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M9.5 7L14.5 12L9.5 17Z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
