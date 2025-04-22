export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex items-start p-4 bg-white border-y-[2px] border-border-weak2">
      {/* 프로필 이미지 */}
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3" />

      {/* 텍스트 영역 */}
      <div className="flex-1">
        {/* 유저 ID와 날짜 */}
        <div className="flex items-start mb-1 flex-col gap-1">
          <div className="w-8 h-4 bg-gray-200 animate-pulse rounded mr-2" />
          <div className="w-8 h-4 bg-gray-200 animate-pulse rounded" />
        </div>

        {/* 제목 */}
        <div className="w-3/4 h-5 bg-gray-200 animate-pulse rounded mb-2" />

        {/* 카테고리 */}
        <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded mb-3" />
      </div>

      <div className="flex flex-col items-end gap-1">
        {/* 썸네일 이미지 */}
        <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-lg ml-3" />
        {/* 좋아요/댓글/북마크 아이콘 */}
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-gray-200 animate-pulse rounded-full" />
          <div className="w-4 h-4 bg-gray-200 animate-pulse rounded-full" />
          <div className="w-4 h-4 bg-gray-200 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
};
