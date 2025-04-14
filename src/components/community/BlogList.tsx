import { useEffect, useRef, useState } from 'react';
import { useBlogs } from '@/hooks';
import { FilterIcon } from '../shared/icon/FilterIcon';
import { CommunityCard } from './CommunityCard';
import { SkeletonCard } from './SkeletonCard';
import { FiltersModal } from './filter';
import { useSearchParams } from 'react-router-dom';

export const BlogList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // URL 쿼리 파라미터에서 초기값 설정
  const initialSort = searchParams.get('sort') || 'popular';
  const initialCategoryIds =
    searchParams
      .get('categoryIds')
      ?.split(',')
      .map(Number)
      .filter((id) => !isNaN(id)) || [];

  const [sort, setSort] = useState<string>(initialSort);
  const [categoryIds, setCategoryIds] = useState<number[]>(initialCategoryIds);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error, isLoading } = useBlogs(); //useBlogs({ sort, categoryIds });
  console.log('data: ', data);

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

  const handleApplyFilters = (filters: { sort: string; categoryIds: number[] }) => {
    setSort(filters.sort);
    setCategoryIds(filters.categoryIds);

    setSearchParams({
      sort: filters.sort,
      categoryIds: filters.categoryIds.join(','),
    });
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  if (isError) {
    return <div>Error: {error?.message || 'Something went wrong'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-roboto font-medium text-lg ml-4 mt-6 mb-4">All blogs</h1>
      <div className="mb-4 ml-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-[30px] h-[30px] p-[4px] border-[1px] border-border-default rounded-lg"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <FilterIcon />
          </div>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
          isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <FiltersModal
          onApply={handleApplyFilters}
          onClose={() => setIsModalOpen(false)}
          initialSort={sort}
          initialCategoryIds={categoryIds}
        />
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
                    writerId={`${blog.writerId}`}
                    createdAt={new Date(blog.createdAt).toLocaleDateString()}
                    title={blog.title}
                    categoryId={blog.categoryId}
                    profileImageUrl="https://via.placeholder.com/40"
                    heartCount={blog.heartCount}
                    comments={blog.commentCount}
                    isBookmarked={blog.isBookmarked}
                    isHearted={blog.isHearted}
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
