import { Swiper, SwiperSlide } from 'swiper/react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '@/types';

interface CategoryFilterSwiperProps {
  onCategoryChange: (categoryCode: number | undefined) => void;
}

export const CategoryFilterSwiper: React.FC<CategoryFilterSwiperProps> = ({ onCategoryChange }) => {
  const [searchParams] = useSearchParams();
  const initialCategoryCode = searchParams.get('categoryCode') ? Number(searchParams.get('categoryCode')) : undefined;

  const handleCategorySelect = (id: number) => {
    const newCategoryCode = initialCategoryCode === id ? undefined : id;
    onCategoryChange(newCategoryCode);
  };

  return (
    <div className="relative flex items-center justify-center w-full max-w-[calc(100%-38px)]">
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
      <Swiper className="swiper-container" spaceBetween={8} slidesPerView="auto" loop={false} allowTouchMove={true}>
        {CATEGORIES.map((category) => (
          <SwiperSlide key={category.id} style={{ width: 'auto' }}>
            <button
              onClick={() => handleCategorySelect(category.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border border-border-default transition-colors whitespace-nowrap ${
                initialCategoryCode === category.id
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
