// // src/pages/BlogList.tsx
// import React, { useEffect, useRef } from 'react';
// import {
//   useBlogs,
//   useUpdateBlogFilters,
//   useAddBlogHeart,
//   useRemoveBlogHeart,
//   useAddBookmark,
//   useRemoveBookmark,
// } from '@/hooks';
// import CommunityCard from './CommunityCard';
// // import SkeletonCard from '../components/SkeletonCard';
// import { BlogSort, Blog, BlogCategory } from '@/types/blog';

// const mockData: Blog[] = [
//   {
//     id: 1,
//     title: 'Understanding React Query v5',
//     content: 'React Query v5 introduces new features and optimizations for data fetching...',
//     writer: 'user123',
//     category: BlogCategory.RESTAURANT_CAFE,
//     imageUrls: ['https://via.placeholder.com/400'],
//     heartCount: 10,
//     commentCount: 5,
//     viewCount: 150,
//     comments: [
//       {
//         id: 1,
//         writer: 'commenter1',
//         content: 'Great article! Helped me a lot.',
//         heartCount: 10,
//         isReply: true,
//         parentId: null,
//         createdDate: '2024-03-26T14:00:00Z',
//         deleted: false,
//       },
//     ],
//     createdDate: '2024-03-26T12:34:56Z',
//   },
//   {
//     id: 2,
//     title: 'Mastering TypeScript Generics',
//     content: 'TypeScript generics allow developers to write flexible and reusable code...',
//     writer: 'dev456',
//     category: BlogCategory.RESTAURANT_CAFE,
//     imageUrls: ['https://via.placeholder.com/400'],
//     heartCount: 15,
//     commentCount: 8,
//     viewCount: 200,
//     comments: [
//       {
//         id: 2,
//         writer: 'commenter2',
//         content: 'This article clarified a lot of my doubts about generics.',
//         heartCount: 5,
//         isReply: false,
//         parentId: null,
//         createdDate: '2024-03-25T11:45:00Z',
//         deleted: false,
//       },
//     ],
//     createdDate: '2024-03-25T09:15:30Z',
//   },
//   {
//     id: 3,
//     title: 'CSS Grid vs Flexbox: Which One to Use?',
//     content: 'Both CSS Grid and Flexbox are powerful tools, but they serve different purposes...',
//     writer: 'techguru',
//     category: BlogCategory.RESTAURANT_CAFE,
//     imageUrls: ['https://via.placeholder.com/400'],
//     heartCount: 7,
//     commentCount: 2,
//     viewCount: 80,
//     comments: [
//       {
//         id: 3,
//         writer: 'commenter3',
//         content: 'This comparison really helped me understand when to use each.',
//         heartCount: 3,
//         isReply: false,
//         parentId: null,
//         createdDate: '2024-03-24T19:10:00Z',
//         deleted: false,
//       },
//     ],
//     createdDate: '2024-03-24T18:22:10Z',
//   },
// ];

// const BlogList: React.FC = () => {
//   // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, isError } = useBlogs();
//   const updateFilters = useUpdateBlogFilters();
//   const addHeartMutation = useAddBlogHeart();
//   const removeHeartMutation = useRemoveBlogHeart();
//   const addBookmarkMutation = useAddBookmark();
//   const removeBookmarkMutation = useRemoveBookmark();

//   // Intersection Observer를 위한 ref
//   const observerRef = useRef<HTMLDivElement | null>(null);

//   // 무한 스크롤 로직
//   // useEffect(() => {
//   //   const observer = new IntersectionObserver(
//   //     (entries) => {
//   //       if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
//   //         fetchNextPage();
//   //       }
//   //     },
//   //     { threshold: 0.1 }
//   //   );

//   //   const currentObserverRef = observerRef.current;
//   //   if (currentObserverRef) {
//   //     observer.observe(currentObserverRef);
//   //   }

//   //   return () => {
//   //     if (currentObserverRef) {
//   //       observer.unobserve(currentObserverRef);
//   //     }
//   //   };
//   // }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

//   // const handleFilterChange = (newFilters: { keyword?: string; sort?: BlogSort }) => {
//   //   updateFilters(newFilters);
//   // };

//   // if (isError) return <div>Error: {error?.message}</div>;

//   // 모든 페이지의 블로그 데이터를 평탄화
//   // const blogs = data?.pages.flatMap((page) => page.data.blogs) || [];

//   return (
//     <div className="max-w-2xl mx-auto">
//       <h1 className='font-roboto font-medium text-lg ml-4 mt-6 mb-4'>All blogs</h1>
//       <div className="mb-4">
//         <select
//           // onChange={(e) => handleFilterChange({ sort: e.target.value as BlogSort })}
//           className="border p-2 rounded ml-4"
//         >
//           <option value={BlogSort.LATEST}>{BlogSort.LATEST}</option>
//           <option value={BlogSort.OLDEST}>{BlogSort.OLDEST}</option>
//           <option value={BlogSort.HEART_COUNT}>{BlogSort.HEART_COUNT}</option>
//           <option value={BlogSort.COMMENT_COUNT}>{BlogSort.COMMENT_COUNT}</option>
//           <option value={BlogSort.VIEW_COUNT}>{BlogSort.VIEW_COUNT}</option>
//         </select>
//       </div>
//       {/* {isLoading ? ( */}
//       {/* <div> */}
//       {/* {Array.from({ length: 5 }).map((_, index) => (
//             <SkeletonCard key={index} />
//           ))} */}
//       {/* 로딩중- 스켈레톤 ui예정 */}
//       {/* </div> */}
//       {/* ) : ( */}
//       <>
//         {mockData.map((blog: Blog, index: number) => (
//           <div className={`bg-white border-y-[2px] ${index === 0 ? 'border-b-0' : ''} ${index === mockData.length - 1 ? 'border-t-0' : ''} border-border-weak2`} key={blog.id}>
//             <CommunityCard
//               key={blog.id}
//               userId={blog.writer}
//               date={new Date(blog.createdDate).toLocaleDateString()}
//               title={blog.title}
//               category={blog.category}
//               profileImageUrl="https://via.placeholder.com/40"
//               likes={blog.heartCount}
//               comments={blog.commentCount}
//               isBookmarked={true} //수정예상
//               onLike={() =>
//                 blog.heartCount > 0 ? removeHeartMutation.mutate(blog.id) : addHeartMutation.mutate(blog.id)
//               }
//               onBookmark={() =>
//                 blog.title //임시
//                   ? removeBookmarkMutation.mutate(blog.id)
//                   : addBookmarkMutation.mutate(blog.id)
//               }
//             />
//           </div>
//         ))}
//         {/* 무한 스크롤 트리거 요소 */}
//         {/* <div ref={observerRef} className="h-10">
//             {isFetchingNextPage && <div>Loading more...</div>}
//             {!hasNextPage && blogs.length > 0 && <div>No more blogs to load</div>}
//           </div> */}
//       </>
//       {/* )} */}
//     </div>
//   );
// };

// export default BlogList;
