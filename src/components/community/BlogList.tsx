// src/pages/BlogList.tsx
import React, { useEffect, useRef } from 'react';
import {
  useBlogs,
  useUpdateBlogFilters,
  useAddBlogHeart,
  useRemoveBlogHeart,
  useAddBookmark,
  useRemoveBookmark,
} from '@/hooks';
import CommunityCard from './CommunityCard';
// import SkeletonCard from '../components/SkeletonCard';
import { BlogSort, Blog } from '@/types/blog';

const BlogList: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, isError } = useBlogs();
  const updateFilters = useUpdateBlogFilters();
  const addHeartMutation = useAddBlogHeart();
  const removeHeartMutation = useRemoveBlogHeart();
  const addBookmarkMutation = useAddBookmark();
  const removeBookmarkMutation = useRemoveBookmark();

  // Intersection Observer를 위한 ref
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 무한 스크롤 로직
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleFilterChange = (newFilters: { keyword?: string; sort?: BlogSort }) => {
    updateFilters(newFilters);
  };

  if (isError) return <div>Error: {error?.message}</div>;

  // 모든 페이지의 블로그 데이터를 평탄화
  const blogs = data?.pages.flatMap((page) => page.data.blogs) || [];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <select
          onChange={(e) => handleFilterChange({ sort: e.target.value as BlogSort })}
          className="border p-2 rounded ml-2"
        >
          <option value={BlogSort.LATEST}>{BlogSort.LATEST}</option>
          <option value={BlogSort.OLDEST}>{BlogSort.OLDEST}</option>
          <option value={BlogSort.HEART_COUNT}>{BlogSort.HEART_COUNT}</option>
          <option value={BlogSort.COMMENT_COUNT}>{BlogSort.COMMENT_COUNT}</option>
          <option value={BlogSort.VIEW_COUNT}>{BlogSort.VIEW_COUNT}</option>
        </select>
      </div>
      {isLoading ? (
        <div>
          {/* {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))} */}
          로딩중- 스켈레톤 ui예정
        </div>
      ) : (
        <>
          {blogs.map((blog: Blog) => (
            <CommunityCard
              key={blog.id}
              userId={blog.writer}
              date={new Date(blog.createdDate).toLocaleDateString()}
              title={blog.title}
              category={blog.category}
              imageUrl={blog.imageUrls[0]}
              profileImageUrl="https://via.placeholder.com/40"
              likes={blog.heartCount}
              comments={blog.commentCount}
              isBookmarked={true} //수정예상
              onLike={() =>
                blog.heartCount > 0 ? removeHeartMutation.mutate(blog.id) : addHeartMutation.mutate(blog.id)
              }
              onBookmark={() =>
                blog.title //임시
                  ? removeBookmarkMutation.mutate(blog.id)
                  : addBookmarkMutation.mutate(blog.id)
              }
            />
          ))}
          {/* 무한 스크롤 트리거 요소 */}
          <div ref={observerRef} className="h-10">
            {isFetchingNextPage && <div>Loading more...</div>}
            {!hasNextPage && blogs.length > 0 && <div>No more blogs to load</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogList;
