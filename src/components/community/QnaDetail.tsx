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
import { useCallback, useRef, useState } from 'react';

interface QnaDetailProps {
  contentId: number;
  onLike: ((event: React.MouseEvent, id: number, isHearted: boolean) => void) | ((event: React.MouseEvent) => void);
  onBookmark:
    | ((event: React.MouseEvent, id: number, isBookmarked: boolean) => void)
    | ((event: React.MouseEvent) => void);
  recommendedData?: Community[];
  handleBlockUserOpen: () => void;
}

export const QnaDetail = ({ contentId, onLike, onBookmark, recommendedData, handleBlockUserOpen }: QnaDetailProps) => {
  const { data: qna, isLoading, error } = useQnaDetail(contentId);
  const { mutate: createComment } = useCreateQnaComment(contentId);
  const { mutate: updateComment } = useUpdateQnaComment(contentId);

  const { mutate: addQnaCommentHeart } = useAddQnaCommentHeart(contentId);
  const { mutate: removeQnaCommentHeart } = useRemoveQnaCommentHeart(contentId);
  const { mutate: deleteComment } = useDeleteQnaComment(contentId);

  const [replyId, setReplyId] = useState<null | number>(null);
  const [editId, setEditId] = useState<null | number>(null);
  const [editText, setEditText] = useState<null | string>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const focusAnswerInput = () => {
    const inputEl = inputRef.current;
    if (!inputEl) return;
    inputEl.focus();
  };

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (error) return <div className="w-full h-screen flex items-center justify-center">Error: {error.message}</div>;
  if (!qna?.data) return <div className="w-full h-screen flex items-center justify-center">No data found</div>;

  const categoryNames = getCategoryNames(qna.data.categoryId);
  const answerCount = qna.data.commentCount;
  const statusLabel = formatQnaStatus(qna.data.status);

  return (
    <main className="bg-bg-medium pb-24 font-roboto">
      <section className="bg-bg-default px-4 pb-5 pt-[88px]">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-bg-brand-weak px-3 py-1 text-text-brand-default">Q&A</span>
          <span className="rounded-full bg-bg-medium px-3 py-1 text-text-weak">{categoryNames}</span>
          <span className="rounded-full bg-bg-medium px-3 py-1 text-text-default">{statusLabel}</span>
        </div>
        <h1 className="mb-4 text-[22px] font-semibold leading-7 text-text-default">{qna.data.title}</h1>
        <div className="flex items-center gap-2" onClick={handleBlockUserOpen}>
          <img
            src={qna.data.writerProfileImageUrl ? qna.data.writerProfileImageUrl : defaultImg}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm font-medium text-text-default">@{qna.data.writerName}</span>
            <span className="text-sm font-medium text-text-weak">{formatDate(qna.data.createdAt)}</span>
          </div>
        </div>
      </section>
      {qna.data.images.length > 0 && <ContentImage images={qna.data.images} title={qna.data.title} />}
      <section className="bg-bg-default px-4">
        <CommunityContent content={qna.data.description} className="pb-6 pt-5 text-base text-text-default" />
      </section>

      <div className="mt-2 flex h-12 items-center justify-between border-y border-solid border-border-default bg-bg-default text-text-weak">
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
          <span className="text-sm font-medium">Helpful</span>
        </button>
        <button className="flex items-center justify-center gap-1 w-full" onClick={focusAnswerInput}>
          <CommentIcon width={24} height={24} />
          <span className="text-sm font-medium">Answer</span>
        </button>
      </div>
      <section className="px-4 bg-bg-medium pb-6">
        <div className="flex items-center gap-2 py-4 text-sm text-text-weak">
          <span>{qna.data.heartCount} helpful</span>
          <span>|</span>
          <span>
            {answerCount} {answerCount === 1 ? 'answer' : 'answers'}
          </span>
        </div>

        <h2 className="mb-3 text-base font-semibold text-text-default">Answers</h2>
        {qna.data.comments.length > 0 ? (
          <CommentList
            comments={qna.data.comments}
            handleCommentLike={handleCommentLike}
            handleDelete={handleDelete}
            replyId={replyId}
            setReplyId={setReplyId}
            editId={editId}
            setEditId={setEditId}
            setEditText={setEditText}
            inputRef={inputRef}
          />
        ) : (
          <div className="rounded-lg border border-dashed border-border-default bg-bg-default px-4 py-6 text-center">
            <p className="text-sm font-medium text-text-default">No answers yet. Be the first to help.</p>
          </div>
        )}
      </section>

      {/* 추천 게시물 */}
      {recommendedData && (
        <section className="bg-bg-default py-5">
          <h2 className="px-4 pb-3 text-base font-semibold text-text-default">Related questions</h2>
          <RecommendSwiper cards={recommendedData} onLike={onLike} onBookmark={onBookmark} />
        </section>
      )}

      {/* 하단 고정 댓글 입력창 */}
      <CommentInput
        editId={editId}
        editText={editText}
        onCommentSubmit={handleCommentSubmit}
        onCommentEdit={handleCommentEdit}
        inputRef={inputRef}
        placeholder="Write an answer"
        submitLabel="Answer"
      />
    </main>
  );
};

function formatQnaStatus(status?: string) {
  if (!status) return 'Open';

  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
