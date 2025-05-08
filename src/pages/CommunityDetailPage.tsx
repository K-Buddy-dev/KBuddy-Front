import { useNavigate, useParams } from 'react-router-dom';
import { Topbar } from '@/components/shared';
import { useAddBlogHeart, useBlogDetail, useRemoveBlogHeart } from '@/hooks';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

// import { RecommendedPostsSwiper } from './RecommendedPostsSwiper';
import { CATEGORIES } from '@/types';
import { CommentInput, ContentImage } from '@/components/community/detail';
import { formatDate } from '@/utils/utils';
import { useState } from 'react';
import { Spinner } from '@/components/shared/spinner';
import { Comment } from '@/components/shared/icon/Icon';

export const CommunityDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const blogId = Number(id);
  const [currentSlide, setCurrentSlide] = useState(1);
  const addBlogHeart = useAddBlogHeart();
  const removeBlogHeart = useRemoveBlogHeart();
  const { data: blog, isLoading, error } = useBlogDetail(blogId);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCommentSubmit = (description: string) => {
    console.log('New comment:', description);
  };

  const handleLike = (blogId: number, isHearted: boolean) => {
    if (isHearted) {
      removeBlogHeart.mutate(blogId, {
        onError: (error) => {
          alert(`Fail remove Like: ${error.message}`);
        },
      });
    } else {
      addBlogHeart.mutate(blogId, {
        onError: (error) => {
          alert(`Fail add Like: ${error.message}`);
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

  //   const blog = data.data;

  const categoryNames = blog.data.categoryId
    .map((id) => CATEGORIES.find((cat) => cat.id === id)?.name)
    .filter(Boolean)
    .join(' | ');

  return (
    <main className="relative min-h-screen pb-24 font-roboto">
      {/* 공유하기 기능 제작해야함 */}
      <Topbar title="" type="back" onBack={handleBack} />

      <div className="pt-[80px] px-4">
        <h1 className="font-medium text-text-default text-[22px] leading-7 mb-1">{blog.data.title}</h1>
        <div className="flex items-center gap-2 text-sm text-text-weak mb-4">
          <span>{categoryNames}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <img
            src="https://images.unsplash.com/photo-1519125323398-675f1f1d1d1f?w=40"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm font-medium text-text-default">@{blog.data.writerId}</span>
            <span className="text-sm font-medium text-text-weak">{formatDate(blog.data.createdAt)}</span>
          </div>
        </div>
      </div>
      {blog.data.images.length > 0 && (
        <ContentImage
          images={blog.data.images}
          title={blog.data.title}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />
      )}
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
        <div className="flex items-center justify-center gap-1 w-full cursor-pointer">
          <Comment width={24} height={24} />
          <span>Commnet</span>
        </div>
      </div>
      <div className="px-4 bg-bg-medium">
        {/* 좋아요 및 댓글 수 */}
        <div className="text-sm text-text-weak mb-4 flex items-center gap-2 py-4">
          <span>{blog.data.heartCount} likes</span>
          <span>|</span>
          <span>{blog.data.commentCount} comments</span>
        </div>

        {/* 댓글 목록 */}
        {/* <CommentList comments={blog.data.comments} /> */}
      </div>

      {/* 추천 게시물 */}
      {/* <RecommendedPostsSwiper posts={recommendedPosts} /> */}

      {/* 하단 고정 댓글 입력창 */}
      <CommentInput onCommentSubmit={handleCommentSubmit} />
    </main>
  );
};
