import { useEffect, useRef } from 'react';
import { useBlogs } from '@/hooks';
import { FilterIcon } from '../shared/icon/FilterIcon';
import { CommunityCard } from './CommunityCard';
import { SkeletonCard } from './SkeletonCard';

export const BlogList: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error, isLoading } = useBlogs();

  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerInstance.current) {
      observerInstance.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('Fetching next page triggered', {
            hasNextPage,
            isFetchingNextPage,
            pageCount: data?.pages.length,
          });
          fetchNextPage();
        }
      },
      { threshold: 0, rootMargin: '100px' } // 요소가 뷰포트에 완전히 들어오기 전에 트리거
    );

    observerInstance.current = observer;

    const currentObserverRef = observerRef.current;
    if (currentObserverRef && !isFetchingNextPage) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data?.pages.length]);

  if (isError) {
    return <div>Error: {error?.message || 'Something went wrong'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-roboto font-medium text-lg ml-4 mt-6 mb-4">All blogs</h1>
      <div className="mb-4 ml-4">
        <div className="w-[30px] h-[30px] p-[4px] border-[1px] border-border-default rounded-lg">
          <div className="w-5 h-5 flex items-center justify-center">
            <FilterIcon />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
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
                    userId={`@${blog.writerId}`}
                    date={new Date(blog.createdAt).toLocaleDateString()}
                    title={blog.title}
                    category={[blog.categoryId.toString()]}
                    profileImageUrl="https://via.placeholder.com/40"
                    likes={blog.heartCount}
                    comments={blog.commentCount}
                    isBookmarked={false}
                    onLike={() => console.log('좋아요')}
                    onBookmark={() => console.log('북마크')}
                  />
                  {pageIndex === data.pages.length - 1 && index === page.data.results.length - 1 && hasNextPage && (
                    <div ref={observerRef} className="h-10 flex justify-center items-center">
                      {isFetchingNextPage ? <div>Loading more...</div> : <div>Scroll to load more</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          {isFetchingNextPage && (
            <div>
              {Array.from({ length: 2 }).map((_, index) => (
                <SkeletonCard key={`fetching-${index}`} />
              ))}
            </div>
          )}
          {data?.pages[0]?.data.results.length === 0 && <div className="text-center py-10">No blogs found</div>}
        </>
      )}
    </div>
  );
};
