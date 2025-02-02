// interface SwiperCardProps {
//   userImg: string;
//   userName: string;
//   createdAt: string;
//   title: string;
//   content: string;
//   postImg: string;
//   postHeart: number;
//   postComment: number;
//   postBookmark: boolean;
// }

function SwiperCardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 w-[312px] h-[162px] py-[14px] px-4 bg-default rounded-base-unit-2 border-[1px] border-week2">
      {children}
    </div>
  );
}

// function SwiperCard({
//   userImg,
//   userName,
//   createdAt,
//   title,
//   content,
//   postImg,
//   postHeart,
//   postComment,
//   postBookmark,
// }: SwiperCardProps) {
function SwiperCard() {
  return (
    <SwiperCardWrapper>
      <div></div>
      <div className="flex flex-col gap-1 py-[3px]">
        {/* post 이미지 */}
        <div className="w-[100px] h-[100px] bg-lime-400 rounded-base-unit-2"></div>
        <div className="flex items-center gap-4"></div>
      </div>
    </SwiperCardWrapper>
  );
}

export function Swiper() {
  return (
    <>
      <SwiperCard />
    </>
  );
}
