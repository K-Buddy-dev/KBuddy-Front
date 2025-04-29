import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '@/types';

export const CategoryFilterSwiper = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [, setSwiper] = useState<SwiperClass | null>(null);

  const categoryCode = searchParams.get('categoryCode') ? Number(searchParams.get('categoryCode')) : undefined;

  const toggleCategory = (id: number) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (categoryCode === id) {
      newSearchParams.delete('categoryCode');
    } else {
      newSearchParams.set('categoryCode', id.toString());
    }

    setSearchParams(newSearchParams);
  };

  return (
    <div className="relative flex items-center w-full max-w-[calc(100%-60px)]">
      <style>
        {`
          .swiper-container {
            user-select: none; /* 텍스트 선택 방지 */
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
          }
          .swiper-slide {
            pointer-events: auto; /* 슬라이드 내 버튼 클릭 가능 */
          }
        `}
      </style>
      <Swiper
        className="swiper-container"
        spaceBetween={8}
        slidesPerView="auto"
        loop={false}
        allowTouchMove={true}
        onSwiper={(e) => setSwiper(e)}
      >
        {CATEGORIES.map((category) => (
          <SwiperSlide key={category.id} style={{ width: 'auto' }}>
            <button
              onClick={() => toggleCategory(category.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border border-border-default transition-colors whitespace-nowrap ${
                categoryCode === category.id
                  ? 'bg-bg-highlight-selected text-bg-brand-default'
                  : 'bg-white text-text-default'
              }`}
            >
              {category.name}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
