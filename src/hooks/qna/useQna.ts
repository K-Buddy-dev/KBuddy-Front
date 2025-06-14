import {
  CommentRequest,
  Community,
  CommunityDetailResponse,
  CommunityListResponse,
  Comment,
  BlogFilters,
  UseRecommendedBlogsProps,
} from '@/types/community';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { qnaQueryKeys } from './qnaKeys';
import { qnaService } from '@/services/qnaService';

// import { Community } from "@/types/qna";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// // QnA 목록 조회 (쿼리 파라미터로 필터 관리)
type QnaQueryKey = readonly [string, BlogFilters];

export const useQnas = () => {
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
    QnaQueryKey,
    number | undefined
  >({
    queryKey: qnaQueryKeys.qna.list(filters),
    queryFn: ({ pageParam }) => {
      return qnaService.getQnas(pageParam, filters.size, filters.keyword, filters.sort, filters.categoryCode);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data.nextId === -1 || !lastPage.data.nextId) return undefined;
      return lastPage.data.nextId;
    },
    initialPageParam: undefined,
  });
};

export const useRecommendedQnas = ({ size = 5, categoryCode }: UseRecommendedBlogsProps = {}) => {
  const filters: BlogFilters = {
    size,
    categoryCode,
  };

  return useQuery<CommunityListResponse, Error>({
    queryKey: qnaQueryKeys.qna.list(filters),
    queryFn: () => {
      return qnaService.getQnas(undefined, filters.size, undefined, undefined, filters.categoryCode);
    },
  });
};

// QnA 단건 조회
export const useQnaDetail = (qnaId: number | null) => {
  return useQuery<CommunityDetailResponse, Error>({
    queryKey: qnaQueryKeys.qna.detail(qnaId ?? 0),
    queryFn: () => qnaService.getQnaById(qnaId!),
    enabled: !!qnaId,
  });
};

// // 북마크된 QnA 목록 조회
// export const useBookmarkedQnas = () => {
//   const [searchParams] = useSearchParams();
//   const filters = {
//     cursor: Number(searchParams.get('cursor')) || 0,
//     size: Number(searchParams.get('size')) || 10,
//   };

//   return useQuery<CommunityListResponse, Error>({
//     queryKey: qnaQueryKeys.qna.bookmarked(filters),
//     queryFn: () => qnaService.getBookmarkedQnas(filters.cursor, filters.size),
//   });
// };

// // QnA 수정 (낙관적 업데이트 적용)
// export const useUpdateQna = (qnaId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation<Qna, Error, QnaRequest, { previousQna: Qna | undefined }>({
//     mutationFn: (data) => qnaService.updateQna(qnaId, data),
//     onMutate: async (updatedQna) => {
//       await queryClient.cancelQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       const previousQna = queryClient.getQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId));
//       if (previousQna) {
//         queryClient.setQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId), {
//           ...previousQna,
//           ...updatedQna,
//         });
//       }
//       return { previousQna };
//     },
//     onError: (error, updatedQna, context) => {
//       if (context?.previousQna) {
//         queryClient.setQueryData(qnaQueryKeys.qna.detail(qnaId), context.previousQna);
//       }
//       console.error(`Failed to update qna ${qnaId}:`, error.message);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('qnas'),
//       });
//     },
//   });
// };

// QnA 삭제
export const useDeleteQna = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (qnaId: number) => qnaService.deleteQna(qnaId),
    onSuccess: (_, qnaId) => {
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'qnas';
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
                  results: page.data.results?.filter((qna: Community) => qna.id !== qnaId),
                },
              })),
            };
          });
        });

      // 쿼리 무효화
      queryClient.removeQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('qnas'),
      });
    },
    onError: (error, qnaId) => {
      console.error(`Failed to delete qna ${qnaId}:`, error.message);
    },
  });
};

// QnA 북마크 추가
export const useAddQnaBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (qnaId) => qnaService.addBookmark(qnaId),
    onSuccess: (_, qnaId) => {
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.bookmarks });
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'qnas';
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
                  results: page.data.results?.map((qna: Community) =>
                    qna.id === qnaId ? { ...qna, isBookmarked: true } : qna
                  ),
                },
              })),
            };
          });
        });
    },
    onError: (error, qnaId) => {
      console.error(`Failed to add bookmark qna ${qnaId}:`, error.message);
    },
  });
};

// QnA 북마크 삭제
export const useRemoveQnaBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (qnaId) => qnaService.removeBookmark(qnaId),
    onSuccess: (_, qnaId) => {
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.bookmarks });
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'qnas';
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
                  results: page.data.results?.map((qna: Community) =>
                    qna.id === qnaId ? { ...qna, isBookmarked: false } : qna
                  ),
                },
              })),
            };
          });
        });
    },
    onError: (error, qnaId) => {
      console.error(`Failed to remove bookmark qna ${qnaId}:`, error.message);
    },
  });
};

export const useAddQnaHeart = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (qnaId) => qnaService.addQnaHeart(qnaId),
    onSuccess: (_, qnaId) => {
      // QnA 상세 정보 업데이트
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });

      // QnA 리스트의 캐시된 데이터를 직접 업데이트
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'qnas';
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
                  results: page.data.results?.map((qna: Community) =>
                    qna.id === qnaId ? { ...qna, heartCount: qna.heartCount + 1, isHearted: true } : qna
                  ),
                },
              })),
            };
          });
        });
    },
    onError: (error, qnaId) => {
      console.error(`Failed to add heart qna ${qnaId}:`, error.message);
    },
  });
};

// QnA 좋아요 삭제
export const useRemoveQnaHeart = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (qnaId) => qnaService.removeQnaHeart(qnaId),
    onSuccess: (_, qnaId) => {
      // QnA 상세 정보 업데이트
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });

      // QnA 리스트의 캐시된 데이터를 직접 업데이트
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'qnas';
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
                  results: page.data.results?.map((qna: Community) =>
                    qna.id === qnaId ? { ...qna, heartCount: Math.max(0, qna.heartCount - 1), isHearted: false } : qna
                  ),
                },
              })),
            };
          });
        });
    },
    onError: (error, qnaId) => {
      console.error(`Failed to remove heart qna ${qnaId}:`, error.message);
    },
  });
};

export const useCreateQnaComment = (qnaId: number) => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, CommentRequest>({
    mutationFn: (data) => qnaService.createComment(qnaId, data),
    onError: (error) => {
      console.error(`Failed to create comment for qna ${qnaId}:`, error.message);
    },
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
    },
  });
};

export const useUpdateQnaComment = (qnaId: number) => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { commentId: number; content: string }>({
    mutationFn: ({ commentId, content }) => {
      const data = { content: content };
      return qnaService.updateComment(qnaId, commentId, data);
    },
    onError: (error, variables) => {
      console.error(`Failed to update comment ${variables.commentId}:`, error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
    },
  });
};

export const useDeleteQnaComment = (qnaId: number) => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (commentId: number) => qnaService.deleteComment(commentId),
    onSuccess: (_, commentId) => {
      queryClient.setQueryData(qnaQueryKeys.qna.detail(qnaId), (oldData: any) => {
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
          predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === 'qnas',
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

export const useAddQnaCommentHeart = (qnaId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (commentId: number) => qnaService.addCommentHeart(commentId),
    onSuccess: (_, commentId) => {
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'qnas';
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

export const useRemoveQnaCommentHeart = (qnaId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (commentId: number) => qnaService.removeCommentHeart(commentId),
    onSuccess: (_, commentId) => {
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
      queryClient
        .getQueryCache()
        .findAll({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'qnas';
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

// // QnA 신고
// export const useReportQna = (qnaId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, ReportRequest>({
//     mutationFn: (data) => qnaService.reportQna(qnaId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//     },
//     onError: (error) => {
//       console.error(`Failed to report qna ${qnaId}:`, error.message);
//     },
//   });
// };
