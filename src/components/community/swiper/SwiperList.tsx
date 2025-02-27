import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { CommentIcon, LikeIcon } from '@/components/icon/Icon';
import { Navigation } from 'swiper/modules';
import { useState } from 'react';
import { FloatLeft, FloatRight } from '@/components/icon';

interface SwiperCardProps {
  userImg: string;
  userName: string;
  createdAt: string;
  title: string;
  content: string;
  postImg: string;
  postHeart: number;
  postComment: number;
  postBookmark: boolean;
}

interface SwiperWrapperProps {
  cards: SwiperCardProps[];
}

function SwiperCardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 w-full min-w-[242px] xs:min-w-none xs:w-[312px] h-[162px] py-[11px] px-[12px] xs:py-[14px] xs:px-4 bg-bg-default border-[1px] border-border-weak2 rounded-lg">
      {children}
    </div>
  );
}

function SwiperCard({
  // userImg,
  userName,
  createdAt,
  title,
  content,
  // postImg,
  postHeart,
  postComment,
  // postBookmark,
}: SwiperCardProps) {
  return (
    <SwiperCardWrapper>
      <div className="flex flex-col gap-1 py-[13px]">
        <div className="flex items-center justify-start gap-2">
          {/* user 이미지 */}
          <div className="w-7 h-7 bg-red-300 rounded-full"></div>
          <div className="flex flex-col items-start justify-start gap-1 font-roboto text-[12px] font-light">
            <h4 className="text-text-default">{userName}</h4>
            <p className="text-text-weak">{createdAt}</p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-1 font-roboto">
          <h3 className="text-[16px] font-medium text-text-default line-clamp-2 leading-[24px]">{title}</h3>
          <p className="text-[14px] font-normal text-text-weak">{content}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 py-[3px]">
        {/* post 이미지 */}
        <div className="w-[100px] h-[100px] bg-lime-400 rounded-base-unit-2"></div>
        <div className="flex items-center justify-start gap-4">
          <div className="flex items-center gap-1 h-full font-roboto text-[14px] font-normal text-text-weak">
            <div className="flex items-center">
              <LikeIcon />
              <span className="flex items-center py-[3px]">{postHeart}</span>
            </div>
            <div className="flex items-center">
              <CommentIcon />
              <span className="flex items-center py-[3px]">{postComment}</span>
            </div>
          </div>
          {/* <div>
            <BookmarkIcon />
          </div> */}
        </div>
      </div>
    </SwiperCardWrapper>
  );
}

function SwiperListWrapper({ children }: { children: React.ReactNode }) {
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

export function SwiperList({ cards }: SwiperWrapperProps) {
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
    <SwiperListWrapper>
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
        spaceBetween={10}
        slidesPerView={1.1}
        breakpoints={{
          360: {
            slidesPerView: 1.1,
            spaceBetween: 20,
            navigation: {
              enabled: false,
            },
          },
          400: {
            slidesPerView: 1.2,
            spaceBetween: 20,
          },
          450: {
            slidesPerView: 1.4,
            spaceBetween: 20,
          },
          500: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          550: {
            slidesPerView: 1.7,
            spaceBetween: 20,
          },
          600: {
            slidesPerView: 1.8,
            spaceBetween: 20,
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
              userImg={card.userImg}
              userName={card.userName}
              createdAt={card.createdAt}
              title={card.title}
              content={card.content}
              postImg={card.postImg}
              postHeart={card.postHeart}
              postComment={card.postComment}
              postBookmark={card.postBookmark}
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
}
