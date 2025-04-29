import { useNavigate, useParams } from 'react-router-dom';
import { Topbar } from '@/components/shared';
import { useBlogDetail } from '@/hooks';

// import { RecommendedPostsSwiper } from './RecommendedPostsSwiper';
import { CATEGORIES } from '@/types';
import { CommentInput, CommentList, ContentImage } from '@/components/community/detail';
import { formatDate } from '@/utils/utils';
import { useState } from 'react';

export const CommunityDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const blogId = Number(id);
  const [currentSlide, setCurrentSlide] = useState(1);
  const { data, isLoading, error } = useBlogDetail(blogId);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCommentSubmit = (description: string) => {
    console.log('New comment:', description);
  };

  // 추천 게시물 더미 데이터 (실제로는 API 호출로 가져와야 함)
  //   const recommendedPosts = [
  //     {
  //       id: 1,
  //       title: 'Discovering the flavors of street food...',
  //       writerId: 2,
  //       createdAt: '2024-11-03',
  //       heartCount: 14,
  //       commentCount: 3,
  //       imageUrl: 'https://via.placeholder.com/150',
  //     },
  //     {
  //       id: 2,
  //       title: 'Exploring Seoul at night',
  //       writerId: 3,
  //       createdAt: '2024-10-15',
  //       heartCount: 20,
  //       commentCount: 5,
  //       imageUrl: 'https://via.placeholder.com/150',
  //     },
  //   ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.data) return <div>No data found</div>;

  //   const blog = data.data;
  const blog = {
    id: 1,
    writerId: 123,
    categoryId: [1], // 예: Daily Life 카테고리
    title: 'Exploring Bukchon in Seoul while wearing a hanbok',
    description:
      'Exploring Bukchon in Seoul while wearing a hanbok was an unforgettable journey into the heart of Korean culture. Strolling through the charming hanok village, the traditional attire made me feel deeply connected to the rich history surrounding me.',
    viewCount: 135,
    createdAt: '2024-04-03T00:00:00Z',
    modifiedAt: '2024-04-03T00:00:00Z',
    images: [
      { id: 1, type: 'PNG', name: 'beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300' },
      { id: 2, type: 'PNG', name: 'city', url: 'https://images.unsplash.com/photo-1519125323398-675f1f1d1d1f?w=300' },
      {
        id: 3,
        type: 'PNG',
        name: 'mountain',
        url: 'https://images.unsplash.com/photo-1494545261883-21b485e793e5?w=300',
      },
    ],
    comments: [],
    heartCount: 20,
    commentCount: 5,
    isBookmarked: false,
    isHearted: false,
    status: 'PUBLISHED',
  };
  const categoryNames = blog.categoryId
    .map((id) => CATEGORIES.find((cat) => cat.id === id)?.name)
    .filter(Boolean)
    .join(' | ');

  return (
    <main className="relative min-h-screen pb-24">
      {/* 공유하기 기능 제작해야함 */}
      <Topbar title="" type="back" onBack={handleBack} />

      <div className="pt-[80px] px-4 font-roboto">
        <h1 className="font-medium text-text-default text-[22px] leading-7 mb-1">{blog.title}</h1>
        <div className="flex items-center gap-2 text-sm text-text-weak mb-4">
          <span>{categoryNames}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <img src="https://via.placeholder.com/40" alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-text-default">@{blog.writerId}</span>
            <span className="text-sm font-medium text-text-weak">{formatDate(blog.createdAt)}</span>
          </div>
        </div>

        {blog.images.length > 0 && (
          <ContentImage
            images={blog.images}
            title={blog.title}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
          />
        )}

        {/* 본문 내용 */}
        <p className="text-base text-text-default py--4">{blog.description}</p>

        {/* 좋아요 및 댓글 버튼 */}
        <div className="flex gap-4 mb-4">
          <button className="flex items-center gap-1 text-sm text-text-default">♥ Like</button>
          <button className="flex items-center gap-1 text-sm text-text-default">💬 Comment</button>
        </div>

        {/* 좋아요 및 댓글 수 */}
        <div className="text-sm text-text-weak mb-4">
          {blog.heartCount} likes • {blog.commentCount} comments
        </div>

        {/* 댓글 목록 */}
        <CommentList comments={blog.comments} />

        {/* 추천 게시물 */}
        {/* <RecommendedPostsSwiper posts={recommendedPosts} /> */}
      </div>

      {/* 하단 고정 댓글 입력창 */}
      <CommentInput onCommentSubmit={handleCommentSubmit} />
    </main>
  );
};
