import { useBlogs } from '@/hooks';
import { FilterIcon } from '../shared/icon/FilterIcon';
import { useEffect, useRef } from 'react';
import { CommunityCard } from './CommunityCard';

const BlogList: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error } = useBlogs();

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 } // 요소가 10% 보일 때 트리거
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return <div>Error: {error?.message || 'Something went wrong'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-roboto font-medium text-lg ml-4 mt-6 mb-4">All blogs</h1>
      <div className="mb-4">
        <div>
          <FilterIcon />
        </div>
      </div>
      {/* {isLoading ? ( */}
      {/* <div> */}
      {/* {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))} */}
      {/* 로딩중- 스켈레톤 ui예정 */}
      {/* </div> */}
      {/* ) : ( */}
      <>
        {data?.pages.map((page, pageIndex) => (
          <div key={pageIndex}>
            {page.data.results.map((blog, index) => (
              <div
                className={`bg-white border-y-[2px] ${index === 0 ? 'border-b-0' : ''} ${
                  index === page.data.results.length - 1 ? 'border-t-0' : ''
                } border-border-weak2`}
                key={blog.id}
              >
                <CommunityCard
                  userId={`@${blog.writerId}`} // writerId를 userId로 사용
                  date={new Date(blog.createdAt).toLocaleDateString()}
                  title={blog.title}
                  category={['1']} // 단일 카테고리 ID를 배열로 전달
                  profileImageUrl="https://via.placeholder.com/40"
                  likes={blog.heartCount}
                  comments={blog.commentCount}
                  isBookmarked={true} // TODO: 북마크 상태를 서버에서 가져와야 함
                  onLike={() =>
                    // blog.heartCount > 0 ? removeHeartMutation.mutate(blog.id) : addHeartMutation.mutate(blog.id)
                    console.log('좋아요')
                  }
                  onBookmark={() =>
                    // blog.isBookmarked // TODO: 실제 북마크 상태에 따라 수정
                    //   ? removeBookmarkMutation.mutate(blog.id)
                    //   : addBookmarkMutation.mutate(blog.id)
                    console.log('북마크')
                  }
                />
              </div>
            ))}
          </div>
        ))}
        {/* 마지막 요소에 observer를 붙여 무한 스크롤 트리거 */}
        {hasNextPage && (
          <div ref={observerRef} className="h-10">
            {isFetchingNextPage ? <div>Loading more...</div> : <div>Scroll to load more</div>}
          </div>
        )}
      </>
      {/* )} */}
    </div>
  );
};

export default BlogList;
