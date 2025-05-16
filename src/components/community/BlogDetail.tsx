import { useParams } from 'react-router-dom';
import {
  useAddBlogHeart,
  useAddBlogBookmark,
  useBlogDetail,
  useRecommendedBlogs,
  useRemoveBlogHeart,
  useRemoveBlogBookmark,
} from '@/hooks';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

import defaultImg from '@/assets/images/default-profile.png';
import { CATEGORIES } from '@/types';
import { CommentInput, CommentList, ContentImage } from '@/components/community/detail';
import { formatDate } from '@/utils/utils';
import { Spinner } from '@/components/shared/spinner';
import { Comment as CommentIcon } from '@/components/shared/icon/Icon';
import { RecommendSwiper } from './swiper';

export const BlogDetail = () => {
  const { id } = useParams();
  const blogId = Number(id);

  const addBlogHeart = useAddBlogHeart();
  const removeBlogHeart = useRemoveBlogHeart();
  const addBlogBookmark = useAddBlogBookmark();
  const removeBlogBookmark = useRemoveBlogBookmark();
  const { data: blog, isLoading, error } = useBlogDetail(blogId);
  const { data: recommendBlog, refetch: refetchRecommended } = useRecommendedBlogs({
    size: 6,
    categoryCode: Array.isArray(blog?.data.categoryId) ? blog?.data.categoryId[0] : blog?.data.categoryId,
  });

  const handleCommentSubmit = (description: string) => {
    console.log('New comment:', description);
  };

  const handleLike = (blogId: number, isHearted: boolean) => {
    if (isHearted) {
      removeBlogHeart.mutate(blogId, {
        onSuccess: () => refetchRecommended(),
        onError: (error) => {
          alert(`Fail remove Like: ${error.message}`);
        },
      });
    } else {
      addBlogHeart.mutate(blogId, {
        onSuccess: () => refetchRecommended(),
        onError: (error) => {
          alert(`Fail add Like: ${error.message}`);
        },
      });
    }
  };

  const handleBookmark = (blogId: number, isBookmarked: boolean) => {
    if (isBookmarked) {
      removeBlogBookmark.mutate(blogId, {
        onSuccess: () => refetchRecommended(),
        onError: (error) => {
          alert(`Fail remove Bookmark: ${error.message}`);
        },
      });
    } else {
      addBlogBookmark.mutate(blogId, {
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
  if (!blog?.data) return <div className="w-screen h-screen flex items-center justify-center">No data found</div>;

  const categoryNames = Array.isArray(blog?.data.categoryId)
    ? blog?.data.categoryId
        .map((id) => CATEGORIES.find((cat) => cat.id === id)?.name)
        .filter(Boolean)
        .join(' | ')
    : CATEGORIES.find((cat) => cat.id === blog?.data.categoryId)?.name || '';

  return (
    <main className=" pb-20 font-roboto">
      <div className="pt-[80px] px-4">
        <h1 className="font-medium text-text-default text-[22px] leading-7 mb-1">{blog.data.title}</h1>
        <div className="flex items-center gap-2 text-sm text-text-weak mb-4">
          <span>{categoryNames}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <img src={defaultImg} alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm font-medium text-text-default">@{blog.data.writerId}</span>
            <span className="text-sm font-medium text-text-weak">{formatDate(blog.data.createdAt)}</span>
          </div>
        </div>
      </div>
      {blog.data.images.length > 0 && <ContentImage images={blog.data.images} title={blog.data.title} />}
      <div className="px-4">
        <p className="text-base text-text-default pt-4 pb-6">{blog.data.description}</p>
      </div>

      <div className="flex items-center justify-between h-10 text-text-weak border-b-[1px] border-solid border-border-default bg-bg-medium">
        <div className="flex items-center justify-center w-full gap-1 cursor-pointer">
          <button
            onClick={() => handleLike(blog.data.id, blog.data.isHearted)}
            className="transition-colors hover:[&>svg]:text-red-500"
          >
            {blog.data.isHearted ? (
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
          <span>{blog.data.heartCount} likes</span>
          <span>|</span>
          <span>{blog.data.commentCount} comments</span>
        </div>

        <CommentList comments={blog.data.comments} />
      </div>

      {/* 추천 게시물 */}
      {recommendBlog?.data && (
        <RecommendSwiper
          cards={recommendBlog?.data.results.filter((data) => data.id !== blogId)}
          onLike={handleLike}
          onBookmark={handleBookmark}
        />
      )}

      {/* 하단 고정 댓글 입력창 */}
      <CommentInput onCommentSubmit={handleCommentSubmit} />
    </main>
  );
};
