import {
  BlogFilters,
  Comment,
  CommentRequest,
  Community,
  CommunityDetailResponse,
  CommunityListResponse,
  UseRecommendedBlogsProps,
} from '@/types/community';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { blogQueryKeys } from './blogKeys';
import { blogService } from '@/services/blogService';

// import { Community } from "@/types/blog";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// // 블로그 목록 조회 (쿼리 파라미터로 필터 관리)
type BlogQueryKey = readonly [string, BlogFilters];

export const useBlogs = () => {
  const [searchParams] = useSearchParams();

  const sort = searchParams.get('sort') || undefined;
  const keyword = searchParams.get('keyword') || undefined;
  const size = Number(searchParams.get('size')) || 10;
  const categoryCode = searchParams.get('categoryCode') ? Number(searchParams.get('categoryCode')) : undefined;

  const filters: BlogFilters = {
    size,
    keyword,
    sort,
    categoryCode,
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
      return blogService.getBlogs(pageParam, filters.size, filters.keyword, filters.sort, filters.categoryCode);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data.nextId === -1 || !lastPage.data.nextId) return undefined;
      return lastPage.data.nextId;
    },
    initialPageParam: undefined,
  });
};

export const useRecommendedBlogs = ({ size = 5, categoryCode }: UseRecommendedBlogsProps = {}) => {
  const filters: BlogFilters = {
    size,
    categoryCode,
  };

  return useQuery<CommunityListResponse, Error>({
    queryKey: blogQueryKeys.blog.list(filters),
    queryFn: () => {
      return blogService.getBlogs(undefined, filters.size, undefined, undefined, filters.categoryCode);
    },
  });
};

export const useFeaturedBlogs = ({ size = 5, sort = 'VIEW_COUNT' }: UseRecommendedBlogsProps = {}) => {
  const filters: BlogFilters = {
    size,
    sort,
  };

  return useQuery<CommunityListResponse, Error>({
    queryKey: blogQueryKeys.blog.list(filters),
    queryFn: () => {
      return blogService.getBlogs(undefined, filters.size, undefined, filters.sort, undefined);
    },
  });
};

// 블로그 단건 조회
export const useBlogDetail = (blogId: number | null) => {
  const { isSuccess: isBlogDeleteSuccess } = useDeleteBlog();

  return useQuery<CommunityDetailResponse, Error>({
    queryKey: blogQueryKeys.blog.detail(blogId ?? 0),
    queryFn: () => blogService.getBlogById(blogId!),
    enabled: !!blogId && !isBlogDeleteSuccess,
    retry: false,
  });
};

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

// 블로그 삭제
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (blogId: number) => blogService.deleteBlog(blogId),
    onSuccess: (_, blogId) => {
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'blogs';
          },
        })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: {
                  ...page.data,
                  results: page.data.results?.filter((blog: Community) => blog.id !== blogId),
                },
              })),
            };
          });
        });

      // 쿼리 무효화
      queryClient.removeQueries({ queryKey: blogQueryKeys.blog.detail(blogId), exact: true });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('blogs'),
      });
    },
    onError: (error, blogId) => {
      console.error(`Failed to delete blog ${blogId}:`, error.message);
    },
  });
};

// 블로그 북마크 추가
export const useAddBlogBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (blogId) => blogService.addBookmark(blogId),
    onSuccess: (_, blogId) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.bookmarks });
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'blogs';
          },
        })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: {
                  ...page.data,
                  results: page.data.results?.map((blog: Community) =>
                    blog.id === blogId ? { ...blog, isBookmarked: true } : blog
                  ),
                },
              })),
            };
          });
        });
    },
    onError: (error, blogId) => {
      console.error(`Failed to add bookmark blog ${blogId}:`, error.message);
    },
  });
};

// 블로그 북마크 삭제
export const useRemoveBlogBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (blogId) => blogService.removeBookmark(blogId),
    onSuccess: (_, blogId) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.bookmarks });
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'blogs';
          },
        })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: {
                  ...page.data,
                  results: page.data.results?.map((blog: Community) =>
                    blog.id === blogId ? { ...blog, isBookmarked: false } : blog
                  ),
                },
              })),
            };
          });
        });
    },
    onError: (error, blogId) => {
      console.error(`Failed to remove bookmark blog ${blogId}:`, error.message);
    },
  });
};

export const useAddBlogHeart = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (blogId) => blogService.addBlogHeart(blogId),
    onSuccess: (_, blogId) => {
      // 블로그 상세 정보 업데이트
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });

      // 블로그 리스트의 캐시된 데이터를 직접 업데이트
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'blogs';
          },
        })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: {
                  ...page.data,
                  results: page.data.results?.map((blog: Community) =>
                    blog.id === blogId ? { ...blog, heartCount: blog.heartCount + 1, isHearted: true } : blog
                  ),
                },
              })),
            };
          });
        });
    },
    onError: (error, blogId) => {
      console.error(`Failed to add heart blog ${blogId}:`, error.message);
    },
  });
};

// 블로그 좋아요 삭제
export const useRemoveBlogHeart = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (blogId) => blogService.removeBlogHeart(blogId),
    onSuccess: (_, blogId) => {
      // 블로그 상세 정보 업데이트
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });

      // 블로그 리스트의 캐시된 데이터를 직접 업데이트
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'blogs';
          },
        })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: {
                  ...page.data,
                  results: page.data.results?.map((blog: Community) =>
                    blog.id === blogId
                      ? { ...blog, heartCount: Math.max(0, blog.heartCount - 1), isHearted: false }
                      : blog
                  ),
                },
              })),
            };
          });
        });
    },
    onError: (error, blogId) => {
      console.error(`Failed to remove heart blog ${blogId}:`, error.message);
    },
  });
};

export const useCreateBlogComment = (blogId: number) => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, CommentRequest>({
    mutationFn: (data) => blogService.createComment(blogId, data),
    onError: (error) => {
      console.error(`Failed to create comment for blog ${blogId}:`, error.message);
    },
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
    },
  });
};

export const useUpdateBlogComment = (blogId: number) => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { commentId: number; content: string }>({
    mutationFn: ({ commentId, content }) => {
      const data = { content: content };
      return blogService.updateComment(commentId, data);
    },
    onError: (error, variables) => {
      console.error(`Failed to update comment ${variables.commentId}:`, error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
    },
  });
};

export const useDeleteBlogComment = (blogId: number) => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (commentId: number) => blogService.deleteComment(commentId),
    onSuccess: (_, commentId) => {
      queryClient.setQueryData(blogQueryKeys.blog.detail(blogId), (oldData: any) => {
        if (!oldData || !oldData.data) return oldData;

        const updatedComments = oldData.data.comments
          .filter((comment: Comment) => comment.id !== commentId)
          .map((comment: Comment) => ({
            ...comment,
            replies: comment.replies?.filter((reply: Comment) => reply.id !== commentId),
          }));

        return {
          ...oldData,
          data: {
            ...oldData.data,
            comments: updatedComments,
            commentCount: Math.max(0, (oldData.data.commentCount || 0) - 1),
          },
        };
      });

      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === 'blogs',
        })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: {
                  ...page.data,
                  comments: page.data.comments
                    ?.filter((comment: Comment) => comment.id !== commentId)
                    ?.map((comment: Comment) => ({
                      ...comment,
                      replies: comment.replies?.filter((reply: Comment) => reply.id !== commentId),
                    })),
                  commentCount: Math.max(0, (page.data.commentCount || 0) - 1),
                },
              })),
            };
          });
        });
    },
    onError: (error, commentId) => {
      console.error(`Failed to delete comment ${commentId}:`, error.message);
    },
  });
};

export const useAddBlogCommentHeart = (blogId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (commentId: number) => blogService.addCommentHeart(blogId, commentId),
    onSuccess: (_, commentId) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'blogs';
          },
        })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: {
                  ...page.data,
                  comments: page.data.comments?.map((comment: Comment) =>
                    comment.id === commentId
                      ? { ...comment, heartCount: comment.heartCount + 1, isHearted: true }
                      : comment
                  ),
                },
              })),
            };
          });
        });
    },
    onError: (error, commentId) => {
      console.error(`Failed to add heart to comment ${commentId}:`, error.message);
    },
  });
};

export const useRemoveBlogCommentHeart = (blogId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (commentId: number) => blogService.removeCommentHeart(blogId, commentId),
    onSuccess: (_, commentId) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.blog.detail(blogId) });
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'blogs';
          },
        })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: {
                  ...page.data,
                  comments: page.data.comments?.map((comment: Comment) =>
                    comment.id === commentId
                      ? { ...comment, heartCount: Math.max(0, comment.heartCount - 1), isHearted: false }
                      : comment
                  ),
                },
              })),
            };
          });
        });
    },
    onError: (error, commentId) => {
      console.error(`Failed to remove heart from comment ${commentId}:`, error.message);
    },
  });
};
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
