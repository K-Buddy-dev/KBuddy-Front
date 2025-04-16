import { BlogFilters, CommunityListResponse, CommunitySort, isCommunitySort } from '@/types/blog';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { blogQueryKeys } from './blogKeys';
import { blogService } from '@/services/blogService';

// import { Community } from "@/types/blog";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// // 블로그 목록 조회 (쿼리 파라미터로 필터 관리)
type BlogQueryKey = readonly [string, BlogFilters];

export const useBlogs = () => {
  const [searchParams] = useSearchParams();

  // 쿼리 파라미터 파싱
  const rawSort = searchParams.get('sort');
  const sort: CommunitySort | undefined = isCommunitySort(rawSort) ? rawSort : undefined;
  const keyword = searchParams.get('keyword') ?? '';
  const size = Number(searchParams.get('size')) || 5;

  const filters: BlogFilters = {
    size,
    keyword,
    sort,
  };

  return useInfiniteQuery<
    CommunityListResponse,
    Error,
    InfiniteData<CommunityListResponse>,
    BlogQueryKey,
    number | undefined
  >({
    queryKey: blogQueryKeys.blog.list(filters),
    queryFn: ({ pageParam }) => {
      console.log('Fetching blogs with id:', pageParam); // 디버깅용 로그
      return blogService.getBlogs(pageParam, filters.size, filters.keyword, filters.sort);
    },
    getNextPageParam: (lastPage) => {
      console.log('Next ID:', lastPage.data.nextId); // 디버깅용 로그
      if (lastPage.data.nextId === -1 || !lastPage.data.nextId) return undefined;
      return lastPage.data.nextId;
    },
    initialPageParam: undefined,
  });
};

// // 필터 업데이트 훅
// export const useUpdateBlogFilters = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   return (newFilters: { size?: number; keyword?: string; sort?: CommunitySort }) => {
//     const updatedParams = new URLSearchParams(searchParams);
//     if (newFilters.size !== undefined) updatedParams.set('size', String(newFilters.size));
//     if (newFilters.keyword !== undefined) updatedParams.set('keyword', newFilters.keyword);
//     if (newFilters.sort !== undefined) updatedParams.set('sort', newFilters.sort);
//     setSearchParams(updatedParams);
//   };
// };

// // 블로그 단건 조회
// export const useBlogDetail = (blogId: number) => {
//   return useQuery<Blog, Error>({
//     queryKey: blogQueryKeys.blog.detail(blogId),
//     queryFn: () => blogService.getBlogById(blogId),
//   });
// };

// // 북마크된 블로그 목록 조회
// export const useBookmarkedBlogs = () => {
//   const [searchParams] = useSearchParams();
//   const filters = {
//     cursor: Number(searchParams.get('cursor')) || 0,
//     size: Number(searchParams.get('size')) || 10,
//   };

//   return useQuery<CommunityListResponse, Error>({
//     queryKey: blogQueryKeys.blog.bookmarked(filters),
//     queryFn: () => blogService.getBookmarkedBlogs(filters.cursor, filters.size),
//   });
// };

// 블로그 생성 (낙관적 업데이트 적용)
// export const useCreateQna = () => {
//   const queryClient = useQueryClient();

//   return useMutation<Community, Error, BlogRequest, { previousBlogs: CommunityListResponse | undefined }>({
//     mutationFn: (data) => blogService.createBlog(data),
//     onMutate: async (newBlog) => {
//       await queryClient.cancelQueries({ queryKey: blogQueryKeys.all });
//       const previousBlogs = queryClient.getQueryData<CommunityListResponse>(blogQueryKeys.blog.list({}));
//       if (previousBlogs) {
//         queryClient.setQueryData<CommunityListResponse>(blogQueryKeys.blog.list({}), {
//           ...previousBlogs,
//           data: {
//             ...previousBlogs.data,
//             results: [
//               {
//                 ...newBlog,
//                 id: Date.now(),
//                 writer: 'currentUser',
//                 heartCount: 0,
//                 commentCount: 0,
//                 viewCount: 0,
//                 comments: [],
//                 createdDate: new Date().toISOString(),
//               },
//               ...previousBlogs.data.result,
//             ],
//           },
//         });
//       }
//       return { previousBlogs };
//     },
//     onError: (error, newBlog, context) => {
//       if (context?.previousBlogs) {
//         queryClient.setQueryData(blogQueryKeys.blog.list({}), context.previousBlogs);
//       }
//       console.error('Failed to create blog:', error.message);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('blogs'),
//       });
//     },
//   });
// };

// // 블로그 수정 (낙관적 업데이트 적용)
// export const useUpdateBlog = (blogId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation<Blog, Error, BlogRequest, { previousBlog: Blog | undefined }>({
//     mutationFn: (data) => blogService.updateBlog(blogId, data),
//     onMutate: async (updatedBlog) => {
//       await queryClient.cancelQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//       const previousBlog = queryClient.getQueryData<Blog>(blogQueryKeys.blog.detail(blogId));
//       if (previousBlog) {
//         queryClient.setQueryData<Blog>(blogQueryKeys.blog.detail(blogId), {
//           ...previousBlog,
//           ...updatedBlog,
//         });
//       }
//       return { previousBlog };
//     },
//     onError: (error, updatedBlog, context) => {
//       if (context?.previousBlog) {
//         queryClient.setQueryData(blogQueryKeys.blog.detail(blogId), context.previousBlog);
//       }
//       console.error(`Failed to update blog ${blogId}:`, error.message);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('blogs'),
//       });
//     },
//   });
// };

// // 블로그 삭제 (낙관적 업데이트 적용)
// export const useDeleteBlog = () => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     void,
//     Error,
//     number,
//     { previousBlog: Blog | undefined; previousBlogs: CommunityListResponse | undefined }
//   >({
//     mutationFn: (blogId) => blogService.deleteBlog(blogId),
//     onMutate: async (blogId) => {
//       await queryClient.cancelQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//       const previousBlog = queryClient.getQueryData<Blog>(blogQueryKeys.blog.detail(blogId));
//       const previousBlogs = queryClient.getQueryData<CommunityListResponse>(blogQueryKeys.blog.list({}));
//       if (previousBlog) {
//         queryClient.setQueryData(blogQueryKeys.blog.detail(blogId), undefined);
//       }
//       if (previousBlogs) {
//         queryClient.setQueryData<CommunityListResponse>(blogQueryKeys.blog.list({}), {
//           ...previousBlogs,
//           data: {
//             ...previousBlogs.data,
//             blogs: previousBlogs.data.blogs.filter((blog: any) => blog.id !== blogId),
//           },
//         });
//       }
//       return { previousBlog, previousBlogs };
//     },
//     onError: (error, blogId, context) => {
//       if (context?.previousBlog) {
//         queryClient.setQueryData(blogQueryKeys.blog.detail(blogId), context.previousBlog);
//       }
//       if (context?.previousBlogs) {
//         queryClient.setQueryData(blogQueryKeys.blog.list({}), context.previousBlogs);
//       }
//       console.error(`Failed to delete blog ${blogId}:`, error.message);
//     },
//     onSettled: (data, error, blogId) => {
//       queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('blogs'),
//       });
//     },
//   });
// };

// // 블로그 북마크 추가 (낙관적 업데이트 적용)
// export const useAddBookmark = () => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     void,
//     Error,
//     number,
//     { previousBlog: Community | undefined; previousBookmarkedBlogs: CommunityListResponse | undefined }
//   >({
//     mutationFn: (blogId) => blogService.addBookmark(blogId),
//     onMutate: async (blogId) => {
//       await queryClient.cancelQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//       await queryClient.cancelQueries({ queryKey: blogQueryKeys.blog.bookmarked({}) });

//       const previousBlog = queryClient.getQueryData<Community>(blogQueryKeys.blog.detail(blogId));
//       const previousBookmarkedBlogs = queryClient.getQueryData<CommunityListResponse>(
//         blogQueryKeys.blog.bookmarked({})
//       );

//       if (previousBlog) {
//         queryClient.setQueryData<Community>(blogQueryKeys.blog.detail(blogId), {
//           ...previousBlog,
//           isBookmarked: true,
//         });

//         if (previousBookmarkedBlogs) {
//           queryClient.setQueryData<CommunityListResponse>(blogQueryKeys.blog.bookmarked({}), {
//             ...previousBookmarkedBlogs,
//             data: {
//               ...previousBookmarkedBlogs.data,
//               blogs: [previousBlog, ...previousBookmarkedBlogs.data.blogs],
//             },
//           });
//         }
//       }

//       return { previousBlog, previousBookmarkedBlogs };
//     },
//     onError: (error, blogId, context) => {
//       if (context?.previousBlog) {
//         queryClient.setQueryData(blogQueryKeys.blog.detail(blogId), context.previousBlog);
//       }
//       if (context?.previousBookmarkedBlogs) {
//         queryClient.setQueryData(blogQueryKeys.blog.bookmarked({}), context.previousBookmarkedBlogs);
//       }
//       alert(`Failed to add bookmark: ${error.message}`);
//     },
//     onSettled: (data, error, blogId) => {
//       if (!error) {
//         queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//         queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.bookmarked({}) });
//       }
//     },
//   });
// };

// // 블로그 북마크 삭제 (낙관적 업데이트 적용)
// export const useRemoveBookmark = () => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     void,
//     Error,
//     number,
//     { previousBlog: Blog | undefined; previousBookmarkedBlogs: CommunityListResponse | undefined }
//   >({
//     mutationFn: (blogId) => blogService.removeBookmark(blogId),
//     onMutate: async (blogId) => {
//       await queryClient.cancelQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//       const previousBlog = queryClient.getQueryData<Blog>(blogQueryKeys.blog.detail(blogId));
//       const previousBookmarkedBlogs = queryClient.getQueryData<CommunityListResponse>(
//         blogQueryKeys.blog.bookmarked({})
//       );
//       if (previousBlog) {
//         queryClient.setQueryData<Blog>(blogQueryKeys.blog.detail(blogId), {
//           ...previousBlog,
//         });
//       }
//       if (previousBookmarkedBlogs) {
//         queryClient.setQueryData<CommunityListResponse>(blogQueryKeys.blog.bookmarked({}), {
//           ...previousBookmarkedBlogs,
//           data: {
//             ...previousBookmarkedBlogs.data,
//             blogs: previousBookmarkedBlogs.data.blogs.filter((blog: any) => blog.id !== blogId),
//           },
//         });
//       }
//       return { previousBlog, previousBookmarkedBlogs };
//     },
//     onError: (error, blogId, context) => {
//       if (context?.previousBlog) {
//         queryClient.setQueryData(blogQueryKeys.blog.detail(blogId), context.previousBlog);
//       }
//       if (context?.previousBookmarkedBlogs) {
//         queryClient.setQueryData(blogQueryKeys.blog.bookmarked({}), context.previousBookmarkedBlogs);
//       }
//       console.error(`Failed to remove bookmark for blog ${blogId}:`, error.message);
//     },
//     onSettled: (data, error, blogId) => {
//       queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('blogBookmarks'),
//       });
//     },
//   });
// };

// // 블로그 좋아요 추가 (낙관적 업데이트 적용)
// export const useAddBlogHeart = () => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, number, { previousBlog: Blog | undefined }>({
//     mutationFn: (blogId) => blogService.addBlogHeart(blogId),
//     onMutate: async (blogId) => {
//       await queryClient.cancelQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//       const previousBlog = queryClient.getQueryData<Blog>(blogQueryKeys.blog.detail(blogId));
//       if (previousBlog) {
//         queryClient.setQueryData<Blog>(blogQueryKeys.blog.detail(blogId), {
//           ...previousBlog,
//           heartCount: previousBlog.heartCount + 1,
//         });
//       }
//       return { previousBlog };
//     },
//     onError: (error, blogId, context) => {
//       if (context?.previousBlog) {
//         queryClient.setQueryData(blogQueryKeys.blog.detail(blogId), context.previousBlog);
//       }
//       console.error(`Failed to add heart for blog ${blogId}:`, error.message);
//     },
//     onSettled: (data, error, blogId) => {
//       queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('blogs'),
//       });
//     },
//   });
// };

// // 블로그 좋아요 삭제 (낙관적 업데이트 적용)
// export const useRemoveBlogHeart = () => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, number, { previousBlog: Blog | undefined }>({
//     mutationFn: (blogId) => blogService.removeBlogHeart(blogId),
//     onMutate: async (blogId) => {
//       await queryClient.cancelQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//       const previousBlog = queryClient.getQueryData<Blog>(blogQueryKeys.blog.detail(blogId));
//       if (previousBlog) {
//         queryClient.setQueryData<Blog>(blogQueryKeys.blog.detail(blogId), {
//           ...previousBlog,
//           heartCount: previousBlog.heartCount - 1,
//         });
//       }
//       return { previousBlog };
//     },
//     onError: (error, blogId, context) => {
//       if (context?.previousBlog) {
//         queryClient.setQueryData(blogQueryKeys.blog.detail(blogId), context.previousBlog);
//       }
//       console.error(`Failed to remove heart for blog ${blogId}:`, error.message);
//     },
//     onSettled: (data, error, blogId) => {
//       queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('blogs'),
//       });
//     },
//   });
// };

// // 댓글 작성 (낙관적 업데이트 적용)
// export const useCreateComment = (blogId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation<Comment, Error, CommentRequest, { previousBlog: Blog | undefined }>({
//     mutationFn: (data) => blogService.createComment(blogId, data),
//     onMutate: async (newComment) => {
//       await queryClient.cancelQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//       const previousBlog = queryClient.getQueryData<Blog>(blogQueryKeys.blog.detail(blogId));
//       if (previousBlog) {
//         queryClient.setQueryData<Blog>(blogQueryKeys.blog.detail(blogId), {
//           ...previousBlog,
//           comments: [
//             ...previousBlog.comments,
//             {
//               id: Date.now(),
//               content: newComment.content,
//               writer: 'currentUser',
//               heartCount: 0,
//               isReply: false,
//               parentId: null,
//               createdDate: new Date().toISOString(),
//               deleted: false,
//             },
//           ],
//           commentCount: previousBlog.commentCount + 1,
//         });
//       }
//       return { previousBlog };
//     },
//     onError: (error, newComment, context) => {
//       if (context?.previousBlog) {
//         queryClient.setQueryData(blogQueryKeys.blog.detail(blogId), context.previousBlog);
//       }
//       console.error(`Failed to create comment for blog ${blogId}:`, error.message);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//     },
//   });
// };

// // 블로그 신고
// export const useReportBlog = (blogId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, ReportRequest>({
//     mutationFn: (data) => blogService.reportBlog(blogId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
//     },
//     onError: (error) => {
//       console.error(`Failed to report blog ${blogId}:`, error.message);
//     },
//   });
// };
