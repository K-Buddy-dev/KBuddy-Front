import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import { CATEGORIES } from '@/types';

interface CategoryFilterSwiperProps {
  categoryIds: number[];
  setCategoryIds: (ids: number[]) => void;
}

export const CategoryFilterSwiper = ({ categoryIds, setCategoryIds }: CategoryFilterSwiperProps) => {
  const [, setSwiper] = useState<SwiperClass | null>(null);

  const toggleCategory = (id: number) => {
    setCategoryIds(
      categoryIds.includes(id) ? categoryIds.filter((categoryId) => categoryId !== id) : [...categoryIds, id]
    );
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
      <Swiper spaceBetween={8} slidesPerView="auto" loop={false} allowTouchMove={true} onSwiper={(e) => setSwiper(e)}>
        {CATEGORIES.map((category) => (
          <SwiperSlide key={category.id} style={{ width: 'auto' }}>
            <button
              onClick={() => toggleCategory(category.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border border-border-default transition-colors whitespace-nowrap ${
                categoryIds.includes(category.id) ? 'bg-bg-brand-default text-white' : 'bg-white text-text-default'
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
