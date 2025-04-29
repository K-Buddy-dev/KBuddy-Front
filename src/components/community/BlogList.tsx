import { useEffect, useRef, useState } from 'react';
import { useAddBlogHeart, useAddBookmark, useBlogs, useRemoveBlogHeart, useRemoveBookmark } from '@/hooks';
import { FilterIcon } from '../shared/icon/FilterIcon';
import { CommunityCard } from './CommunityCard';
import { SkeletonCard } from './SkeletonCard';
import { FiltersModal } from './filter';
import { useSearchParams } from 'react-router-dom';
import { CategoryFilterSwiper } from './swiper';

export const BlogList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState<number>(0);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error, isLoading } = useBlogs();
  console.log('hasNextPage: ', hasNextPage);

  const addBlogHeart = useAddBlogHeart();
  const removeBlogHeart = useRemoveBlogHeart();
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleApplyFilters = (filters: { sort: string; categoryCode: number | undefined }) => {
    const scrollY = window.scrollY;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('sort', filters.sort);
    if (filters.categoryCode !== undefined) {
      newSearchParams.set('categoryCode', filters.categoryCode.toString());
    } else {
      newSearchParams.delete('categoryCode');
    }
    setSearchParams(newSearchParams);
    setTimeout(() => window.scrollTo(0, scrollY), 0);
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

  const handleBookmark = (blogId: number, isBookmarked: boolean) => {
    if (isBookmarked) {
      removeBookmark.mutate(blogId, {
        onError: (error) => {
          alert(`Fail remove Bookmark: ${error.message}`);
        },
      });
    } else {
      addBookmark.mutate(blogId, {
        onError: (error) => {
          alert(`Fail add Bookmark: ${error.message}`);
        },
      });
    }
  };

  if (isError) {
    return <div>Error: {error?.message || 'Something went wrong'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-roboto font-medium text-lg ml-4 mt-6 mb-4">All blogs</h1>
      <div className="mb-4 ml-4 flex items-center gap-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-[30px] h-[30px] p-[4px] border-[1px] border-border-default rounded-lg"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <FilterIcon />
          </div>
          {filterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-bg-highlight-selected text-bg-brand-default text-xs rounded-full">
              {filterCount}
            </span>
          )}
        </button>
        <CategoryFilterSwiper />
      </div>

      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
          isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <FiltersModal
          onApply={handleApplyFilters}
          onClose={() => setIsModalOpen(false)}
          setFilterCount={setFilterCount}
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
              {page.data.results.map((blog, index) => {
                const isLastItem = pageIndex === data.pages.length - 1 && index === page.data.results.length - 1;

                return (
                  <div
                    className={`bg-white border-y-[2px] border-b-0 border-border-weak2`}
                    key={blog.id}
                    ref={isLastItem ? observerRef : null}
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
                      onLike={() => handleLike(blog.id, blog.isHearted)}
                      onBookmark={() => handleBookmark(blog.id, blog.isBookmarked)}
                    />
                  </div>
                );
              })}
            </div>
          ))}
          {hasNextPage && (
            <div ref={observerRef} className="h-10 pt-6 flex justify-center items-center">
              {isFetchingNextPage ? <div>Loading...</div> : <div>Show More</div>}
            </div>
          )}
        </>
      )}
      <div className="h-[136px]"></div>
    </div>
  );
};
