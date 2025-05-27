import {
  useAddQnaCommentHeart,
  useCreateQnaComment,
  useDeleteQnaComment,
  useQnaDetail,
  useRemoveQnaCommentHeart,
  useUpdateQnaComment,
} from '@/hooks';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

import defaultImg from '@/assets/images/default-profile.png';
import { Community } from '@/types';
import { CommentInput, CommentList, ContentImage } from '@/components/community/detail';
import { formatDate, getCategoryNames } from '@/utils';
import { Spinner } from '@/components/shared/spinner';
import { Comment as CommentIcon } from '@/components/shared/icon/Icon';
import { RecommendSwiper } from './swiper';
import { CommunityContent } from './CommunityContent';
import { useCallback, useState } from 'react';

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
  const { mutate: createComment } = useCreateQnaComment(contentId);
  const { mutate: updateComment } = useUpdateQnaComment(contentId);

  const { mutate: addQnaCommentHeart } = useAddQnaCommentHeart(contentId);
  const { mutate: removeQnaCommentHeart } = useRemoveQnaCommentHeart(contentId);
  const { mutate: deleteComment } = useDeleteQnaComment(contentId);

  const [replyId, setReplyId] = useState<null | number>(null);
  const [editId, setEditId] = useState<null | number>(null);
  const [editText, setEditText] = useState<null | string>(null);

  const handleCommentSubmit = (description: string) => {
    if (!description.trim()) return;

    const commentRequest = { content: description, parentId: replyId };

    try {
      createComment(commentRequest);
      setReplyId(null);
    } catch (error) {
      console.error('Fail create Comment:', error);
    }
  };

  const handleCommentEdit = (id: number, description: string) => {
    if (!description.trim()) return;

    const commentRequest = { commentId: id, content: description };

    try {
      updateComment(commentRequest);
      setEditId(null);
      setEditText(null);
    } catch (error) {
      console.error('Fail create Comment:', error);
    }
  };

  const handleCommentLike = useCallback(
    (event: React.MouseEvent, commentId: number, isHearted: boolean) => {
      event.stopPropagation();
      if (isHearted) {
        removeQnaCommentHeart(commentId, {
          onError: (error) => alert(`Fail remove Like: ${error.message}`),
        });
      } else {
        addQnaCommentHeart(commentId, {
          onError: (error) => alert(`Fail add Like: ${error.message}`),
        });
      }
    },
    [removeQnaCommentHeart, addQnaCommentHeart]
  );

  const handleDelete = useCallback(
    (commentId: number) => {
      deleteComment(commentId);
    },
    [deleteComment]
  );

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (error) return <div className="w-screen h-screen flex items-center justify-center">Error: {error.message}</div>;
  if (!qna?.data) return <div className="w-screen h-screen flex items-center justify-center">No data found</div>;

  const categoryNames = getCategoryNames(qna.data.categoryId);

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

        <CommentList
          comments={qna.data.comments}
          handleCommentLike={handleCommentLike}
          handleDelete={handleDelete}
          replyId={replyId}
          setReplyId={setReplyId}
          editId={editId}
          setEditId={setEditId}
          setEditText={setEditText}
        />
      </div>

      {/* 추천 게시물 */}
      {recommendedData && <RecommendSwiper cards={recommendedData} onLike={onLike} onBookmark={onBookmark} />}

      {/* 하단 고정 댓글 입력창 */}
      <CommentInput
        editId={editId}
        editText={editText}
        onCommentSubmit={handleCommentSubmit}
        onCommentEdit={handleCommentEdit}
      />
    </main>
  );
};
