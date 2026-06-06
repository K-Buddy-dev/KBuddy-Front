import {
  useAddBlogCommentHeart,
  useBlogDetail,
  useCreateBlogComment,
  useDeleteBlogComment,
  useRemoveBlogCommentHeart,
  useUpdateBlogComment,
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

interface BlogDetailProps {
  contentId: number;
  onLike: ((event: React.MouseEvent, id: number, isHearted: boolean) => void) | ((event: React.MouseEvent) => void);
  onBookmark:
    | ((event: React.MouseEvent, id: number, isBookmarked: boolean) => void)
    | ((event: React.MouseEvent) => void);
  recommendedData?: Community[];
  handleBlockUserOpen: () => void;
}

export const BlogDetail = ({
  contentId,
  onLike,
  onBookmark,
  recommendedData,
  handleBlockUserOpen,
}: BlogDetailProps) => {
  const { data: blog, isLoading, error } = useBlogDetail(contentId);
  const { mutate: createComment } = useCreateBlogComment(contentId);
  const { mutate: updateComment } = useUpdateBlogComment(contentId);

  const { mutate: addBlogCommentHeart } = useAddBlogCommentHeart(contentId);
  const { mutate: removeBlogCommentHeart } = useRemoveBlogCommentHeart(contentId);
  const { mutate: deleteComment } = useDeleteBlogComment(contentId);

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
        removeBlogCommentHeart(commentId, {
          onError: (error) => alert(`Fail remove Like: ${error.message}`),
        });
      } else {
        addBlogCommentHeart(commentId, {
          onError: (error) => alert(`Fail add Like: ${error.message}`),
        });
      }
    },
    [removeBlogCommentHeart, addBlogCommentHeart]
  );

  const handleDelete = useCallback(
    (commentId: number) => {
      deleteComment(commentId);
    },
    [deleteComment]
  );

  const focusCommentInput = () => {
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
  if (!blog?.data) return <div className="w-full h-screen flex items-center justify-center">No data found</div>;

  const categoryNames = getCategoryNames(blog.data.categoryId);

  return (
    <main className="bg-bg-medium pb-24 font-roboto">
      <section className="bg-bg-default px-4 pb-5 pt-[88px]">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-bg-brand-weak px-3 py-1 text-text-brand-default">Article</span>
          <span className="rounded-full bg-bg-medium px-3 py-1 text-text-weak">{categoryNames}</span>
        </div>
        <h1 className="mb-4 text-[24px] font-semibold leading-8 text-text-default">{blog.data.title}</h1>
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleBlockUserOpen}>
          <img
            src={blog.data.writerProfileImageUrl ? blog.data.writerProfileImageUrl : defaultImg}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm font-medium text-text-default">@{blog.data.writerName}</span>
            <span className="text-sm font-medium text-text-weak">{formatDate(blog.data.createdAt)}</span>
          </div>
        </div>
      </section>
      {blog.data.images.length > 0 && <ContentImage images={blog.data.images} title={blog.data.title} />}
      <article className="bg-bg-default px-4">
        <CommunityContent content={blog.data.description} className="pb-8 pt-6 text-base leading-7 text-text-default" />
      </article>

      <div className="mt-2 flex h-12 items-center justify-between border-y border-solid border-border-default bg-bg-default text-text-weak">
        <button
          className="flex items-center justify-center w-full gap-1 cursor-pointer group"
          onClick={(event) => onLike(event, blog.data.id, blog.data.isHearted)}
        >
          <div className="transition-colors group-hover:[&>svg]:text-red-500">
            {blog.data.isHearted ? (
              <FaHeart className="w-6 h-6 text-red-500 fill-current" />
            ) : (
              <FaRegHeart className="w-6 h-6 text-text-weak stroke-current" />
            )}
          </div>
          <span className="transition-colors group-hover:text-red-500">Like</span>
        </button>
        <button className="flex items-center justify-center gap-1 w-full" onClick={focusCommentInput}>
          <CommentIcon width={24} height={24} />
          <span>Comment</span>
        </button>
      </div>
      <section className="px-4 bg-bg-medium pb-6">
        <div className="text-sm text-text-weak flex items-center gap-2 py-4">
          <span>{blog.data.heartCount} likes</span>
          <span>|</span>
          <span>{blog.data.commentCount} comments</span>
        </div>

        <h2 className="mb-3 text-base font-semibold text-text-default">Comments</h2>
        {blog.data.comments.length > 0 ? (
          <CommentList
            comments={blog.data.comments}
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
            <p className="text-sm font-medium text-text-default">No comments yet. Start the conversation.</p>
          </div>
        )}
      </section>

      {/* 추천 게시물 */}
      {recommendedData && (
        <section className="bg-bg-default py-5">
          <h2 className="px-4 pb-3 text-base font-semibold text-text-default">Related posts</h2>
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
        placeholder="Write a comment"
      />
    </main>
  );
};
