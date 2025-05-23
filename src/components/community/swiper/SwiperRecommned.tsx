import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FloatLeft, FloatRight } from '@/components/shared';
import { SwiperCard, SwiperWrapperProps } from './SwiperList';

function SwiperListWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-w-[280px] w-full sm:w-[600px] h-[250px] pb-6 pl-4 font-roboto font-medium">
      <h1 className="pt-6 pb-4 text-lg leading-[24px] text-text-default">You might also like this</h1>
      {children}
    </div>
  );
}

const styles = `
  @media (max-width: 599px) {
    .swiper-button-next,
    .swiper-button-prev {
      display: none !important;
    }
  }
  .swiper-slide-view-all {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding-right: 16px;
  }
`;

export const RecommendSwiper = ({ cards, onLike, onBookmark }: SwiperWrapperProps) => {
  const [, setSwiperIndex] = useState<number>(0);
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [isBeginning, setIsBeginning] = useState<boolean>(true);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isBlog = location.search.includes('blog');

  const viewAllPath = isBlog ? '/community?tab=User+blog' : '/community?tab=Q%26A';

  const handleViewAllClick = () => {
    navigate(viewAllPath);
  };

  const handlePrev = () => swiper?.slidePrev();
  const handleNext = () => swiper?.slideNext();

  return (
    <div className="w-full">
      <SwiperListWrapper>
        <style>{styles}</style>
        <Swiper
          onSlideChange={(e: SwiperClass) => {
            setIsBeginning(e.isBeginning);
            setIsEnd(e.isEnd);
          }}
          onReachEnd={() => setIsEnd(true)}
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={1.1}
          breakpoints={{
            360: { slidesPerView: 1.1, spaceBetween: 20 },
            400: { slidesPerView: 1.2, spaceBetween: 20 },
            450: { slidesPerView: 1.4, spaceBetween: 20 },
            500: { slidesPerView: 1.5, spaceBetween: 20 },
            550: { slidesPerView: 1.7, spaceBetween: 20 },
            600: {
              slidesPerView: 1.8,
              spaceBetween: 20,
              navigation: { enabled: true, nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            },
          }}
          onActiveIndexChange={(e) => setSwiperIndex(e.realIndex)}
          onSwiper={(e) => setSwiper(e)}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <SwiperCard
                id={card.id}
                writerUuid={card.writerUuid}
                writerName={card.writerName}
                writerProfileImageUrl={card.writerProfileImageUrl}
                thumbnailImageUrl={card.thumbnailImageUrl}
                categoryId={card.categoryId}
                title={card.title}
                description={card.description}
                viewCount={card.viewCount}
                heartCount={card.heartCount}
                isHearted={card.isHearted}
                isBookmarked={card.isBookmarked}
                commentCount={card.commentCount}
                createdAt={card.createdAt}
                onLike={onLike}
                onBookmark={onBookmark}
              />
            </SwiperSlide>
          ))}
          <SwiperSlide key="view-all" className="swiper-slide-view-all">
            <div className="flex items-center justify-start w-full h-[162px] px-4">
              <button onClick={handleViewAllClick} className="text-sm leading-[24px] text-text-default underline">
                View All Posts →
              </button>
            </div>
          </SwiperSlide>
        </Swiper>

        <div>
          <div
            onClick={handlePrev}
            className={`swiper-button-prev absolute top-[47%] left-4 z-10 flex items-center justify-center rounded-full ${isBeginning && 'hidden'}`}
          >
            <FloatLeft />
          </div>
          <div
            onClick={handleNext}
            className={`swiper-button-next absolute top-[47%] right-4 z-10 flex items-center justify-center rounded-full ${isEnd && 'hidden'}`}
          >
            <FloatRight />
          </div>
        </div>
      </SwiperListWrapper>
    </div>
  );
};
