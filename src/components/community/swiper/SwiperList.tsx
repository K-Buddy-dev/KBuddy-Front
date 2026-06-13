import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from 'react-icons/fa';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import { CommentIcon } from '@/components/shared/icon/Icon';

import { FloatLeft, FloatRight } from '@/components/shared/icon';
import { Community } from '@/types';
import { formatDate, getCategoryNames } from '@/utils';

import defaultImg from '@/assets/images/default-profile.png';

export interface SwiperWrapperProps {
  cards: Community[];
  layout?: 'default' | 'home';
  onLike: (event: React.MouseEvent, id: number, isHearted: boolean) => void;
  onBookmark: (event: React.MouseEvent, id: number, isBookmarked: boolean) => void;
}

function SwiperCardWrapper({ children, onclick }: { children: React.ReactNode; onclick: () => void }) {
  return (
    <div
      onClick={onclick}
      className="flex h-[162px] w-full cursor-pointer items-start justify-between rounded-lg border border-border-weak2 bg-bg-default px-[12px] py-[11px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.04),_0px_4px_8px_0px_rgba(0,0,0,0.06)] xs:px-4 xs:py-[14px]"
    >
      {children}
    </div>
  );
}

export function SwiperCard({
  id,
  title,
  writerName,
  writerProfileImageUrl,
  categoryId,
  heartCount,
  commentCount,
  createdAt,
  isHearted,
  isBookmarked,
  onLike,
  onBookmark,
  thumbnailImageUrl,
}: Community & {
  onLike: (event: React.MouseEvent, id: number, isHearted: boolean) => void;
  onBookmark: (event: React.MouseEvent, id: number, isBookmarked: boolean) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const NAVIGATION_CARD = location.search ? location.search : '?tab=Userblog';

  const categoryNames = getCategoryNames(categoryId);

  const handleNavigate = () => {
    const newPath = `/community/detail/${id}${NAVIGATION_CARD}`;
    navigate(newPath);
  };

  return (
    <SwiperCardWrapper onclick={handleNavigate}>
      <div className="flex flex-col gap-2 font-roboto">
        <div className="flex items-center gap-2 font-medium">
          <img src={writerProfileImageUrl || defaultImg} alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="font-roboto font-medium">
            <p className="text-xs text-text-default">@{writerName}</p>
            <p className="text-xs text-text-weak">{formatDate(createdAt)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-medium text-text-default line-clamp-2 leading-[24px]">{title}</h3>
          <p className="text-[14px] font-normal text-text-weak">{categoryNames}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 py-[3px]">
        {thumbnailImageUrl ? (
          <div>
            <img src={thumbnailImageUrl} alt={`${title}_image`} className="w-[100px] h-[100px] object-cover rounded" />
          </div>
        ) : (
          <div className="w-[100px] h-[100px]"></div>
        )}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              className="flex items-center gap-1 group"
              onClick={(e) => {
                onLike(e, id, isHearted);
              }}
            >
              <div className="transition-colors group-hover:[&>svg]:text-red-500">
                {isHearted ? (
                  <FaHeart className="w-4 h-4 text-red-500 fill-current" />
                ) : (
                  <FaRegHeart className="w-4 h-4 text-text-weak stroke-current" />
                )}
              </div>
              <span className="text-sm group-hover:text-red-500 text-text-weak">{heartCount}</span>
            </button>
            <div className="flex items-center gap-1 text-[14px] text-text-weak">
              <CommentIcon />
              <span>{commentCount}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              onBookmark(e, id, isBookmarked);
            }}
            className="flex items-center transition-colors hover:[&>svg]:text-[#6952F9]"
          >
            {isBookmarked ? (
              <FaBookmark className="w-4 h-4 text-[#6952F9] fill-current" />
            ) : (
              <FaRegBookmark className="w-4 h-4 text-text-weak stroke-current" />
            )}
          </button>
        </div>
      </div>
    </SwiperCardWrapper>
  );
}

export function SwiperListWrapper({
  children,
  layout = 'default',
}: {
  children: React.ReactNode;
  layout?: 'default' | 'home';
}) {
  if (layout === 'home') {
    return (
      <section aria-label="Featured posts" className="px-5">
        <div className="relative h-[250px] w-full rounded-lg bg-gradient-to-r from-bg-brand-light to-bg-brand-default pb-6 pl-4">
          <h2 className="pb-4 pt-6 text-[18px] leading-[24px] text-white">Featured posts</h2>
          {children}
        </div>
      </section>
    );
  }

  return (
    <div className="relative min-w-[280px] w-full sm:w-[600px] h-[250px] bg-gradient-to-r from-bg-brand-light to-bg-brand-default pb-6 pl-4">
      <h1 className="pt-6 pb-4 text-[18px] leading-[24px] text-white">Featured posts</h1>
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
`;

export const SwiperList = ({ cards, layout = 'default', onLike, onBookmark }: SwiperWrapperProps) => {
  const [, setSwiperIndex] = useState<number>(0);
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [isBeginning, setIsBeginning] = useState<boolean>(true);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const handlePrev = () => {
    swiper?.slidePrev();
  };
  const handleNext = () => {
    swiper?.slideNext();
  };

  return (
    <SwiperListWrapper layout={layout}>
      <style>{styles}</style>
      <Swiper
        onSlideChange={(e: SwiperClass) => {
          setIsBeginning(e.isBeginning);
          setIsEnd(e.isEnd);
        }}
        onReachEnd={() => {
          setIsEnd(true);
        }}
        modules={[Navigation]}
        spaceBetween={layout === 'home' ? 24 : 10}
        slidesPerView={1}
        breakpoints={{
          360: {
            slidesPerView: 1,
            spaceBetween: layout === 'home' ? 24 : 20,
            navigation: {
              enabled: false,
            },
          },
          400: {
            slidesPerView: 1,
            spaceBetween: layout === 'home' ? 24 : 20,
          },
          450: {
            slidesPerView: 1,
            spaceBetween: layout === 'home' ? 24 : 20,
          },
          500: {
            slidesPerView: 1,
            spaceBetween: layout === 'home' ? 24 : 20,
          },
          550: {
            slidesPerView: 1,
            spaceBetween: layout === 'home' ? 24 : 20,
          },
          600: {
            slidesPerView: 1,
            spaceBetween: layout === 'home' ? 24 : 20,
            navigation: {
              enabled: true,
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          },
        }}
        onActiveIndexChange={(e) => setSwiperIndex(e.realIndex)}
        onSwiper={(e) => {
          setSwiper(e);
        }}
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
      </Swiper>
      <div>
        <div
          onClick={handlePrev}
          className={`swiper-button-prev absolute top-[47%] left-4 z-10 flex items-center justify-center rounded-full ${isBeginning && ' hidden'}`}
        >
          <FloatLeft />
        </div>
        <div
          onClick={handleNext}
          className={`swiper-button-next absolute top-[47%] right-4 z-10 flex items-center justify-center rounded-full ${isEnd && ' hidden'}`}
        >
          <FloatRight />
        </div>
      </div>
    </SwiperListWrapper>
  );
};
