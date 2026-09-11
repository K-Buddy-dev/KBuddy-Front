import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useBlogs } from '@/hooks';
import { FilterIcon } from '../shared/icon/FilterIcon';
import { CommunityCard } from './CommunityCard';
import { SkeletonCard } from './SkeletonCard';
import { FiltersModal } from './filter';
import { CategoryFilterSwiper } from './swiper';
import { formatDate } from '@/utils';
import { NoContent } from './detail';
import { BlogContentType } from '@/types/post';
import { BUDDY_CATEGORIES, POST_CATEGORIES } from '@/constants';

interface BlogProps {
  type?: BlogContentType;
  title?: string;
  onLike: (event: React.MouseEvent, id: number, isHearted: boolean) => void;
  onBookmark: (event: React.MouseEvent, id: number, isBookmarked: boolean) => void;
}

export const BlogList = ({ type = 'GENERAL', title = 'All blogs', onLike, onBookmark }: BlogProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState<number>(0);
  const categories = type === 'BUDDY' ? BUDDY_CATEGORIES : POST_CATEGORIES;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error, isLoading } = useBlogs(type);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sort = searchParams.get('sort') || 'LATEST';
    const categoryCode = searchParams.get('categoryCode') ? Number(searchParams.get('categoryCode')) : undefined;

    let count = 0;
    if (sort !== 'LATEST') count += 1;
    if (categoryCode !== undefined) count += 1;
    setFilterCount(count);
  }, [searchParams]);

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

  const handleCategoryChange = (categoryCode: number | undefined) => {
    const scrollY = window.scrollY;
    const newSearchParams = new URLSearchParams(searchParams);
    if (categoryCode !== undefined) {
      newSearchParams.set('categoryCode', categoryCode.toString());
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

  useEffect(() => {
    const savedScrollY = sessionStorage.getItem('scrollY');
    if (savedScrollY) {
      window.scrollTo(0, parseInt(savedScrollY, 10));
      sessionStorage.removeItem('scrollY');
    }
  }, [location.key]);

  const handleDetail = (blogId: number) => {
    sessionStorage.setItem('scrollY', String(window.scrollY));
    navigate(`/community/detail/${blogId}${location.search}`);
  };

  if (data?.pages[0].data.results.length === 0)
    if (isError) {
      return <div>Error: {error?.message || 'Something went wrong'}</div>;
    }

  return (
    <div className="max-w-2xl mx-auto">
      {type === 'BUDDY' && (
        <section className="mx-4 mt-6 rounded-lg bg-bg-brand-weak p-4">
          <h1 className="font-roboto text-xl font-semibold text-text-default">Find your buddy in Korea</h1>
          <p className="mt-2 text-sm leading-5 text-text-weak">
            Introduce yourself and meet language exchange partners, local friends, and hobby buddies.
          </p>
          <button
            className="mt-4 h-11 w-full rounded-lg bg-bg-brand-default text-sm font-semibold text-text-inverted-default"
            onClick={() => navigate('/community/post/type-category?type=Buddy')}
          >
            Create Buddy Profile
          </button>
        </section>
      )}
      <h1 className="font-roboto font-medium text-lg ml-4 mt-6 mb-4">{title}</h1>
      <div className="mb-4 ml-4 flex items-center gap-2">
        <button
          aria-label="Open filters"
          onClick={() => setIsModalOpen(true)}
          className={`w-[30px] h-[30px] p-[4px] border-[1px] rounded-lg relative cursor-pointer ${
            filterCount > 0 ? 'bg-bg-highlight-selected border-border-brand-default' : 'bg-none border-border-default'
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <FilterIcon color={filterCount > 0 ? '#6952F9' : '#222222'} />
          </div>
          {filterCount > 0 && (
            <span className="absolute -bottom-2 -right-[10px] w-5 h-5 flex items-center justify-center bg-bg-brand-default text-text-inverted-default border-[1px] border-solid border-bg-default text-xs rounded-full">
              {filterCount}
            </span>
          )}
        </button>
        <CategoryFilterSwiper categories={categories} onCategoryChange={handleCategoryChange} />
      </div>

      <div
        data-testid="filter-modal-overlay"
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
          isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <FiltersModal categories={categories} onApply={handleApplyFilters} onClose={() => setIsModalOpen(false)} />
      </div>

      {isLoading ? (
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : data && data.pages[0].data.results.length > 0 ? (
        <>
          {data.pages.map((page, pageIndex) => (
            <div key={pageIndex}>
              {page.data.results.map((blog, index) => {
                const isLastItem = pageIndex === data.pages.length - 1 && index === page.data.results.length - 1;

                return (
                  <div
                    className={`bg-white border-y-[2px] border-b-0 border-border-weak2 cursor-pointer`}
                    key={blog.id}
                    ref={isLastItem ? observerRef : null}
                    onClick={() => handleDetail(blog.id)}
                  >
                    <CommunityCard
                      writerUuid={`${blog.writerUuid}`}
                      writerName={blog.writerName}
                      writerProfileImageUrl={blog.writerProfileImageUrl}
                      thumbnailImageUrl={blog.thumbnailImageUrl}
                      createdAt={formatDate(blog.createdAt)}
                      title={blog.title}
                      categoryId={blog.categoryId}
                      categoryOptions={categories}
                      heartCount={blog.heartCount}
                      comments={blog.commentCount}
                      isBookmarked={blog.isBookmarked}
                      isHearted={blog.isHearted}
                      onLike={(e) => onLike(e, blog.id, blog.isHearted)}
                      onBookmark={(e) => onBookmark(e, blog.id, blog.isBookmarked)}
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
      ) : type === 'BUDDY' ? null : (
        <NoContent type="blog" />
      )}
      <div className="h-[136px]"></div>
    </div>
  );
};
