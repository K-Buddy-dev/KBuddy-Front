import { useParams } from 'react-router-dom';
import {
  useAddQnaHeart,
  useAddQnaBookmark,
  useQnaDetail,
  useRecommendedQnas,
  useRemoveQnaHeart,
  useRemoveQnaBookmark,
} from '@/hooks';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

import defaultImg from '@/assets/images/default-profile.png';
import { CATEGORIES } from '@/types';
import { CommentInput, CommentList, ContentImage } from '@/components/community/detail';
import { formatDate } from '@/utils/utils';
import { Spinner } from '@/components/shared/spinner';
import { Comment as CommentIcon } from '@/components/shared/icon/Icon';
import { RecommendSwiper } from './swiper';

export const QnaDetail = () => {
  const { id } = useParams();
  const qnaId = Number(id);

  const addQnaHeart = useAddQnaHeart();
  const removeQnaHeart = useRemoveQnaHeart();
  const addQnaBookmark = useAddQnaBookmark();
  const removeQnaBookmark = useRemoveQnaBookmark();
  const { data: qna, isLoading, error } = useQnaDetail(qnaId);
  const { data: recommendQna, refetch: refetchRecommended } = useRecommendedQnas({
    size: 6,
    categoryCode: Array.isArray(qna?.data.categoryId) ? qna?.data.categoryId[0] : qna?.data.categoryId,
  });

  const handleCommentSubmit = (description: string) => {
    console.log('New comment:', description);
  };

  const handleLike = (qnaId: number, isHearted: boolean) => {
    if (isHearted) {
      removeQnaHeart.mutate(qnaId, {
        onSuccess: () => refetchRecommended(),
        onError: (error) => {
          alert(`Fail remove Like: ${error.message}`);
        },
      });
    } else {
      addQnaHeart.mutate(qnaId, {
        onSuccess: () => refetchRecommended(),
        onError: (error) => {
          alert(`Fail add Like: ${error.message}`);
        },
      });
    }
  };

  const handleBookmark = (qnaId: number, isBookmarked: boolean) => {
    if (isBookmarked) {
      removeQnaBookmark.mutate(qnaId, {
        onSuccess: () => refetchRecommended(),
        onError: (error) => {
          alert(`Fail remove Bookmark: ${error.message}`);
        },
      });
    } else {
      addQnaBookmark.mutate(qnaId, {
        onSuccess: () => refetchRecommended(),
        onError: (error) => {
          alert(`Fail add Bookmark: ${error.message}`);
        },
      });
    }
  };

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (error) return <div className="w-screen h-screen flex items-center justify-center">Error: {error.message}</div>;
  if (!qna?.data) return <div className="w-screen h-screen flex items-center justify-center">No data found</div>;

  const categoryNames = Array.isArray(qna?.data.categoryId)
    ? qna?.data.categoryId
        .map((id) => CATEGORIES.find((cat) => cat.id === id)?.name)
        .filter(Boolean)
        .join(' | ')
    : CATEGORIES.find((cat) => cat.id === qna?.data.categoryId)?.name || '';

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
            <span className="text-sm font-medium text-text-default">@{qna.data.writerId}</span>
            <span className="text-sm font-medium text-text-weak">{formatDate(qna.data.createdAt)}</span>
          </div>
        </div>
      </div>
      {qna.data.images.length > 0 && <ContentImage images={qna.data.images} title={qna.data.title} />}
      <div className="px-4">
        <p className="text-base text-text-default pt-4 pb-6">{qna.data.description}</p>
      </div>

      <div className="flex items-center justify-between h-10 text-text-weak border-b-[1px] border-solid border-border-default bg-bg-medium">
        <div className="flex items-center justify-center w-full gap-1 cursor-pointer">
          <button
            onClick={() => handleLike(qna.data.id, qna.data.isHearted)}
            className="transition-colors hover:[&>svg]:text-red-500"
          >
            {qna.data.isHearted ? (
              <FaHeart className="w-6 h-6 text-red-500 fill-current" />
            ) : (
              <FaRegHeart className="w-6 h-6 text-text-weak stroke-current" />
            )}
          </button>
          <span>Like</span>
        </div>
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
      {recommendQna?.data && (
        <RecommendSwiper
          cards={recommendQna?.data.results.filter((data) => data.id !== qnaId)}
          onLike={handleLike}
          onBookmark={handleBookmark}
        />
      )}

      {/* 하단 고정 댓글 입력창 */}
      <CommentInput onCommentSubmit={handleCommentSubmit} />
    </main>
  );
};
