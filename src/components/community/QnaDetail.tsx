import { useQnaDetail } from '@/hooks';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

import defaultImg from '@/assets/images/default-profile.png';
import { CATEGORIES, Community } from '@/types';
import { CommentInput, CommentList, ContentImage } from '@/components/community/detail';
import { formatDate } from '@/utils/utils';
import { Spinner } from '@/components/shared/spinner';
import { Comment as CommentIcon } from '@/components/shared/icon/Icon';
import { RecommendSwiper } from './swiper';
import { CommunityContent } from './CommunityContent';

interface QnaDetailProps {
  contentId: number;
  onLike: ((event: React.MouseEvent, id: number, isHearted: boolean) => void) | ((event: React.MouseEvent) => void);
  onBookmark:
    | ((event: React.MouseEvent, id: number, isBookmarked: boolean) => void)
    | ((event: React.MouseEvent) => void);
  recommendedData?: Community[];
}

export const QnaDetail = ({ contentId, onLike, onBookmark, recommendedData }: QnaDetailProps) => {
  const { data: qna, isLoading, error } = useQnaDetail(contentId);

  const handleCommentSubmit = (description: string) => {
    console.log('New comment:', description);
  };

  const categoryNames = Array.isArray(qna?.data.categoryId)
    ? qna?.data.categoryId
        .map((id) => CATEGORIES.find((cat) => cat.id === id)?.name)
        .filter(Boolean)
        .join(' | ')
    : CATEGORIES.find((cat) => cat.id === qna?.data.categoryId)?.name || '';

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (error) return <div className="w-screen h-screen flex items-center justify-center">Error: {error.message}</div>;
  if (!qna?.data) return <div className="w-screen h-screen flex items-center justify-center">No data found</div>;

  return (
    <main className=" pb-20 font-roboto">
      <div className="pt-[80px] px-4">
        <h1 className="font-medium text-text-default text-[22px] leading-7 mb-1">{qna.data.title}</h1>
        <div className="flex items-center gap-2 text-sm text-text-weak mb-4">
          <span>{categoryNames}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <img src={defaultImg} alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm font-medium text-text-default">@{qna.data.writerName}</span>
            <span className="text-sm font-medium text-text-weak">{formatDate(qna.data.createdAt)}</span>
          </div>
        </div>
      </div>
      {qna.data.images.length > 0 && <ContentImage images={qna.data.images} title={qna.data.title} />}
      <div className="px-4">
        <CommunityContent content={qna.data.description} className="text-base text-text-default pt-4 pb-6" />
      </div>

      <div className="flex items-center justify-between h-10 text-text-weak border-b-[1px] border-solid border-border-default bg-bg-medium">
        <button
          className="flex items-center justify-center w-full gap-1 cursor-pointer group"
          onClick={(e: React.MouseEvent) => onLike(e, qna.data.id, qna.data.isHearted)}
        >
          <div className="transition-colors group-hover:[&>svg]:text-red-500">
            {qna.data.isHearted ? (
              <FaHeart className="w-6 h-6 text-red-500 fill-current" />
            ) : (
              <FaRegHeart className="w-6 h-6 text-text-weak stroke-current" />
            )}
          </div>
          <span className="group-hover:[&>svg]:text-red-500">Like</span>
        </button>
        <div className="flex items-center justify-center gap-1 w-full">
          <CommentIcon width={24} height={24} />
          <span>Comment</span>
        </div>
      </div>
      <div className="px-4 bg-bg-medium pb-6">
        <div className="text-sm text-text-weak flex items-center gap-2 py-4">
          <span>{qna.data.heartCount} likes</span>
          <span>|</span>
          <span>{qna.data.commentCount} comments</span>
        </div>

        <CommentList comments={qna.data.comments} />
      </div>

      {/* 추천 게시물 */}
      {recommendedData && <RecommendSwiper cards={recommendedData} onLike={onLike} onBookmark={onBookmark} />}

      {/* 하단 고정 댓글 입력창 */}
      <CommentInput onCommentSubmit={handleCommentSubmit} />
    </main>
  );
};
