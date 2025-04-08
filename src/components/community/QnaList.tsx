// import { useBlogs } from '@/hooks';
import { FilterIcon } from '../shared/icon/FilterIcon';

const QnaList: React.FC = () => {
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useBlogs();
  // const updateFilters = useUpdateBlogFilters();
  // const addHeartMutation = useAddBlogHeart();
  // const removeHeartMutation = useRemoveBlogHeart();
  // const addBookmarkMutation = useAddBookmark();
  // const removeBookmarkMutation = useRemoveBookmark();

  // Intersection Observer를 위한 ref
  // const observerRef = useRef<HTMLDivElement | null>(null);

  // 무한 스크롤 로직
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
  //         fetchNextPage();
  //       }
  //     },
  //     { threshold: 0.1 }
  //   );

  //   const currentObserverRef = observerRef.current;
  //   if (currentObserverRef) {
  //     observer.observe(currentObserverRef);
  //   }

  //   return () => {
  //     if (currentObserverRef) {
  //       observer.unobserve(currentObserverRef);
  //     }
  //   };
  // }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // const handleFilterChange = (newFilters: { keyword?: string; sort?: BlogSort }) => {
  //   updateFilters(newFilters);
  // };

  // if (isError) return <div>Error: {error?.message}</div>;

  // 모든 페이지의 블로그 데이터를 평탄화
  // const blogs = data?.pages.flatMap((page) => page.data.blogs) || [];

  return (
    <div className="max-w-2xl mx-auto">
      <button className="w-[86px] h-[30px] border-[1px] rounded-lg border-border-default bg-bg-default mt-6 mb-4 ml-4 flex items-center justify-center gap-2">
        <div className="w-5 h-5">
          <FilterIcon />
        </div>
        <p className="font-roboto font-medium text-xs">Filters</p>
      </button>
      {/* {isLoading ? ( */}
      {/* <div> */}
      {/* {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))} */}
      {/* 로딩중- 스켈레톤 ui예정 */}
      {/* </div> */}
      {/* ) : ( */}
      <>
        {/* {mockData.map((blog: Blog, index: number) => (
          <div className={`bg-white border-y-[2px] ${index === 0 ? 'border-b-0' : ''} ${index === mockData.length - 1 ? 'border-t-0' : ''} border-border-weak2`} key={blog.id}>
            <CommunityCard
              key={blog.id}
              userId={blog.writer}
              date={new Date(blog.createdDate).toLocaleDateString()}
              title={blog.title}
              category={blog.category}
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
          </div> */}
        {/* ))} */}
      </>
      {/* )} */}
    </div>
  );
};

export default QnaList;
