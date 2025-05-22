import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { FilterIcon } from '../shared/icon/FilterIcon';
import { CommunityCard } from './CommunityCard';
import { SkeletonCard } from './SkeletonCard';
import { FiltersModal } from './filter';
import { useQnas } from '@/hooks/qna/useQna';
import { NoContent } from './detail/NoContent';

interface QnaProps {
  onLike: (event: React.MouseEvent, id: number, isHearted: boolean) => void;
  onBookmark: (event: React.MouseEvent, id: number, isBookmarked: boolean) => void;
}

export const QnaList = ({ onLike, onBookmark }: QnaProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState<number>(0);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error, isLoading } = useQnas();

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

  const handleDetail = (qnaId: number) => {
    sessionStorage.setItem('scrollY', String(window.scrollY));
    navigate(`/community/detail/${qnaId}${location.search}`);
  };

  if (isError) {
    return <div>Error: {error?.message || 'Something went wrong'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setIsModalOpen(true)}
        className={`w-[86px] h-[30px] mt-6 mb-4 ml-4 flex items-center justify-center gap-2 border-[1px] p-[4px] rounded-lg cursor-pointer ${
          filterCount > 0 ? 'bg-bg-highlight-selected border-border-brand-default' : 'bg-none border-border-default'
        }`}
      >
        <div className="relative">
          <div className="w-5 h-5 flex items-center justify-center">
            <FilterIcon color={filterCount > 0 ? '#6952F9' : '#222222'} />
          </div>
          {filterCount > 0 && (
            <span className="absolute -bottom-2 -right-[10px] w-5 h-5 flex items-center justify-center bg-bg-brand-default text-text-inverted-default border-[1px] border-solid border-bg-default text-xs rounded-full">
              {filterCount}
            </span>
          )}
        </div>
        <span className="font-roboto text-xs text-text-default font-medium">Filters</span>
      </button>

      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
          isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <FiltersModal onApply={handleApplyFilters} onClose={() => setIsModalOpen(false)} />
      </div>

      {isLoading ? (
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : data && data.pages[0].data.results.length > 0 ? (
        <>
          {data?.pages.map((page, pageIndex) => (
            <div key={pageIndex}>
              {page.data.results.map((qna, index) => {
                const isLastItem = pageIndex === data.pages.length - 1 && index === page.data.results.length - 1;

                return (
                  <div
                    className={`bg-white border-y-[2px] border-b-0 border-border-weak2 cursor-pointer`}
                    key={qna.id}
                    ref={isLastItem ? observerRef : null}
                    onClick={() => handleDetail(qna.id)}
                  >
                    <CommunityCard
                      writerId={`${qna.writerId}`}
                      createdAt={new Date(qna.createdAt).toLocaleDateString()}
                      title={qna.title}
                      categoryId={qna.categoryId}
                      heartCount={qna.heartCount}
                      comments={qna.commentCount}
                      isBookmarked={qna.isBookmarked}
                      isHearted={qna.isHearted}
                      onLike={(e) => onLike(e, qna.id, qna.isHearted)}
                      onBookmark={(e) => onBookmark(e, qna.id, qna.isBookmarked)}
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
      ) : (
        <NoContent type="qna" />
      )}
      <div className="h-[136px]"></div>
    </div>
  );
};
