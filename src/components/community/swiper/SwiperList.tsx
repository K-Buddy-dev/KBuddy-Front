import { Swiper, SwiperSlide } from 'swiper/react';
import { CommentIcon, LikeIcon } from '@/components/icon/Icon';

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
    <div className="flex items-center gap-4 w-[312px] h-[162px] py-[14px] px-4 bg-bg-default border-[1px] border-border-weak2 rounded-lg">
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
    <div className="min-w-[280px] w-full sm:w-[360px] h-[250px] bg-gradient-to-r from-bg-brand-light to-bg-brand-default pb-6 pl-4">
      <h1 className="pt-6 pb-4 text-[18px] leading-[24px] text-white">Featured posts</h1>
      {children}
    </div>
  );
}

export function SwiperList({ cards }: SwiperWrapperProps) {
  return (
    <SwiperListWrapper>
      <Swiper spaceBetween={10} slidesPerView={1.1} navigation={false}>
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
    </SwiperListWrapper>
  );
}
