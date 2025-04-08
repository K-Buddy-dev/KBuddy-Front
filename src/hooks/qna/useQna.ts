// import { useQuery, useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
// import { useSearchParams } from 'react-router-dom';
// import { qnaService } from '@/services/qnaService'; // QnA 서비스로 가정
// import { qnaQueryKeys } from './qnaKeys';
// import { QnaListResponse, Qna, QnaRequest, CommentRequest, QnaSort } from '@/types/qna'; // QnA 타입으로 가정

// // QnaSort 값 검증 타입 가드 (Swagger에서 sort 값이 정의된다고 가정)
// const isQnaSort = (value: string | null | undefined): value is QnaSort => {
//   return ['LATEST', 'POPULAR'].includes(value as QnaSort); // 예시 sort 값 (Swagger에서 확인 필요)
// };

// // Q&A 게시글 전체 조회 (쿼리 파라미터로 필터 관리)
// export const useQnas = () => {
//   const [searchParams] = useSearchParams();
//   const rawSort = searchParams.get('sort');
//   const sort: QnaSort | undefined = isQnaSort(rawSort) ? rawSort : undefined;

//   const filters = {
//     cursor: Number(searchParams.get('cursor')) || undefined,
//     size: Number(searchParams.get('size')) || 10,
//     keyword: searchParams.get('keyword') || undefined,
//     sort,
//   };

//   return useInfiniteQuery<QnaListResponse, Error, InfiniteData<QnaListResponse>, any, number | undefined>({
//     queryKey: qnaQueryKeys.qna.list(filters),
//     queryFn: ({ pageParam }) => qnaService.getQnas({ ...filters, cursor: pageParam }),
//     getNextPageParam: (lastPage) => {
//       if (!lastPage.data.hasNext) return undefined;
//       return lastPage.data.nextCursor;
//     },
//     initialPageParam: undefined,
//   });
// };

// // 필터 업데이트 훅
// export const useUpdateQnaFilters = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   return (newFilters: { cursor?: number; size?: number; keyword?: string; sort?: QnaSort }) => {
//     const updatedParams = new URLSearchParams(searchParams);
//     if (newFilters.cursor !== undefined) updatedParams.set('cursor', String(newFilters.cursor));
//     if (newFilters.size !== undefined) updatedParams.set('size', String(newFilters.size));
//     if (newFilters.keyword !== undefined) updatedParams.set('keyword', newFilters.keyword);
//     if (newFilters.sort !== undefined) updatedParams.set('sort', newFilters.sort);
//     setSearchParams(updatedParams);
//   };
// };

// // 특정 Q&A 게시글 조회
// export const useQnaDetail = (qnaId: number) => {
//   return useQuery<Qna, Error>({
//     queryKey: qnaQueryKeys.qna.detail(qnaId),
//     queryFn: () => qnaService.getQnaById(qnaId),
//   });
// };

// // 즐겨찾기된 Q&A 게시글 목록 조회
// export const useBookmarkedQnas = () => {
//   const [searchParams] = useSearchParams();
//   const filters = {
//     cursor: Number(searchParams.get('cursor')) || 0,
//     size: Number(searchParams.get('size')) || 10,
//   };

//   return useQuery<QnaListResponse, Error>({
//     queryKey: qnaQueryKeys.qna.bookmarked(filters),
//     queryFn: () => qnaService.getBookmarkedQnas(filters),
//   });
// };

// // Q&A 게시글 작성 (낙관적 업데이트 적용)
// export const useCreateQna = () => {
//   const queryClient = useQueryClient();

//   return useMutation<Qna, Error, QnaRequest, { previousQnas: QnaListResponse | undefined }>({
//     mutationFn: (data) => qnaService.createQna(data),
//     onMutate: async (newQna) => {
//       await queryClient.cancelQueries({ queryKey: qnaQueryKeys.all });
//       const previousQnas = queryClient.getQueryData<QnaListResponse>(qnaQueryKeys.qna.list({}));
//       if (previousQnas) {
//         queryClient.setQueryData<QnaListResponse>(qnaQueryKeys.qna.list({}), {
//           ...previousQnas,
//           data: {
//             ...previousQnas.data,
//             qnas: [
//               {
//                 ...newQna,
//                 id: Date.now(), // 임시 ID
//                 writer: 'currentUser', // 실제 사용자 정보로 대체 필요
//                 heartCount: 0,
//                 commentCount: 0,
//                 viewCount: 0,
//                 comments: [],
//                 createdDate: new Date().toISOString(),
//               },
//               ...previousQnas.data.qnas,
//             ],
//           },
//         });
//       }
//       return { previousQnas };
//     },
//     onError: (error, newQna, context) => {
//       if (context?.previousQnas) {
//         queryClient.setQueryData(qnaQueryKeys.qna.list({}), context.previousQnas);
//       }
//       console.error('Failed to create QnA:', error.message);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('qnas'),
//       });
//     },
//   });
// };

// // Q&A 게시글 업데이트 (낙관적 업데이트 적용)
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
//       console.error(`Failed to update QnA ${qnaId}:`, error.message);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('qnas'),
//       });
//     },
//   });
// };

// // Q&A 게시글 삭제 (낙관적 업데이트 적용)
// export const useDeleteQna = () => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     void,
//     Error,
//     number,
//     { previousQna: Qna | undefined; previousQnas: QnaListResponse | undefined }
//   >({
//     mutationFn: (qnaId) => qnaService.deleteQna(qnaId),
//     onMutate: async (qnaId) => {
//       await queryClient.cancelQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       const previousQna = queryClient.getQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId));
//       const previousQnas = queryClient.getQueryData<QnaListResponse>(qnaQueryKeys.qna.list({}));
//       if (previousQna) {
//         queryClient.setQueryData(qnaQueryKeys.qna.detail(qnaId), undefined);
//       }
//       if (previousQnas) {
//         queryClient.setQueryData<QnaListResponse>(qnaQueryKeys.qna.list({}), {
//           ...previousQnas,
//           data: {
//             ...previousQnas.data,
//             qnas: previousQnas.data.qnas.filter((qna: any) => qna.id !== qnaId),
//           },
//         });
//       }
//       return { previousQna, previousQnas };
//     },
//     onError: (error, qnaId, context) => {
//       if (context?.previousQna) {
//         queryClient.setQueryData(qnaQueryKeys.qna.detail(qnaId), context.previousQna);
//       }
//       if (context?.previousQnas) {
//         queryClient.setQueryData(qnaQueryKeys.qna.list({}), context.previousQnas);
//       }
//       console.error(`Failed to delete QnA ${qnaId}:`, error.message);
//     },
//     onSettled: (data, error, qnaId) => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('qnas'),
//       });
//     },
//   });
// };

// // Q&A 게시글 즐겨찾기 추가 (낙관적 업데이트 적용)
// export const useAddBookmark = () => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     void,
//     Error,
//     number,
//     { previousQna: Qna | undefined; previousBookmarkedQnas: QnaListResponse | undefined }
//   >({
//     mutationFn: (qnaId) => qnaService.addBookmark(qnaId),
//     onMutate: async (qnaId) => {
//       await queryClient.cancelQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       const previousQna = queryClient.getQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId));
//       const previousBookmarkedQnas = queryClient.getQueryData<QnaListResponse>(qnaQueryKeys.qna.bookmarked({}));
//       if (previousQna) {
//         queryClient.setQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId), {
//           ...previousQna,
//           isBookmarked: true, // 즐겨찾기 상태 업데이트 (필요 시 Qna 타입에 추가)
//         });
//       }
//       if (previousBookmarkedQnas && previousQna) {
//         queryClient.setQueryData<QnaListResponse>(qnaQueryKeys.qna.bookmarked({}), {
//           ...previousBookmarkedQnas,
//           data: {
//             ...previousBookmarkedQnas.data,
//             qnas: [previousQna, ...previousBookmarkedQnas.data.qnas],
//           },
//         });
//       }
//       return { previousQna, previousBookmarkedQnas };
//     },
//     onError: (error, qnaId, context) => {
//       if (context?.previousQna) {
//         queryClient.setQueryData(qnaQueryKeys.qna.detail(qnaId), context.previousQna);
//       }
//       if (context?.previousBookmarkedQnas) {
//         queryClient.setQueryData(qnaQueryKeys.qna.bookmarked({}), context.previousBookmarkedQnas);
//       }
//       console.error(`Failed to add bookmark for QnA ${qnaId}:`, error.message);
//     },
//     onSettled: (data, error, qnaId) => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('qnaBookmarks'),
//       });
//     },
//   });
// };

// // Q&A 게시글 즐겨찾기 삭제 (낙관적 업데이트 적용)
// export const useRemoveBookmark = () => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     void,
//     Error,
//     number,
//     { previousQna: Qna | undefined; previousBookmarkedQnas: QnaListResponse | undefined }
//   >({
//     mutationFn: (qnaId) => qnaService.removeBookmark(qnaId),
//     onMutate: async (qnaId) => {
//       await queryClient.cancelQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       const previousQna = queryClient.getQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId));
//       const previousBookmarkedQnas = queryClient.getQueryData<QnaListResponse>(qnaQueryKeys.qna.bookmarked({}));
//       if (previousQna) {
//         queryClient.setQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId), {
//           ...previousQna,
//           isBookmarked: false, // 즐겨찾기 상태 업데이트 (필요 시 Qna 타입에 추가)
//         });
//       }
//       if (previousBookmarkedQnas) {
//         queryClient.setQueryData<QnaListResponse>(qnaQueryKeys.qna.bookmarked({}), {
//           ...previousBookmarkedQnas,
//           data: {
//             ...previousBookmarkedQnas.data,
//             qnas: previousBookmarkedQnas.data.qnas.filter((qna: any) => qna.id !== qnaId),
//           },
//         });
//       }
//       return { previousQna, previousBookmarkedQnas };
//     },
//     onError: (error, qnaId, context) => {
//       if (context?.previousQna) {
//         queryClient.setQueryData(qnaQueryKeys.qna.detail(qnaId), context.previousQna);
//       }
//       if (context?.previousBookmarkedQnas) {
//         queryClient.setQueryData(qnaQueryKeys.qna.bookmarked({}), context.previousBookmarkedQnas);
//       }
//       console.error(`Failed to remove bookmark for QnA ${qnaId}:`, error.message);
//     },
//     onSettled: (data, error, qnaId) => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('qnaBookmarks'),
//       });
//     },
//   });
// };

// // Q&A 게시글 좋아요 추가 (낙관적 업데이트 적용)
// export const useAddQnaHeart = () => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, number, { previousQna: Qna | undefined }>({
//     mutationFn: (qnaId) => qnaService.addQnaHeart(qnaId),
//     onMutate: async (qnaId) => {
//       await queryClient.cancelQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       const previousQna = queryClient.getQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId));
//       if (previousQna) {
//         queryClient.setQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId), {
//           ...previousQna,
//           heartCount: previousQna.heartCount + 1,
//           isHearted: true, // 좋아요 상태 업데이트 (필요 시 Qna 타입에 추가)
//         });
//       }
//       return { previousQna };
//     },
//     onError: (error, qnaId, context) => {
//       if (context?.previousQna) {
//         queryClient.setQueryData(qnaQueryKeys.qna.detail(qnaId), context.previousQna);
//       }
//       console.error(`Failed to add heart for QnA ${qnaId}:`, error.message);
//     },
//     onSettled: (data, error, qnaId) => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('qnas'),
//       });
//     },
//   });
// };

// // Q&A 게시글 좋아요 취소 (낙관적 업데이트 적용)
// export const useRemoveQnaHeart = () => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, number, { previousQna: Qna | undefined }>({
//     mutationFn: (qnaId) => qnaService.removeQnaHeart(qnaId),
//     onMutate: async (qnaId) => {
//       await queryClient.cancelQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       const previousQna = queryClient.getQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId));
//       if (previousQna) {
//         queryClient.setQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId), {
//           ...previousQna,
//           heartCount: previousQna.heartCount - 1,
//           isHearted: false, // 좋아요 상태 업데이트 (필요 시 Qna 타입에 추가)
//         });
//       }
//       return { previousQna };
//     },
//     onError: (error, qnaId, context) => {
//       if (context?.previousQna) {
//         queryClient.setQueryData(qnaQueryKeys.qna.detail(qnaId), context.previousQna);
//       }
//       console.error(`Failed to remove heart for QnA ${qnaId}:`, error.message);
//     },
//     onSettled: (data, error, qnaId) => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey.includes('qnas'),
//       });
//     },
//   });
// };

// // 댓글 작성 (낙관적 업데이트 적용)
// export const useCreateComment = (qnaId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation<Comment, Error, CommentRequest, { previousQna: Qna | undefined }>({
//     mutationFn: (data) => qnaService.createComment(qnaId, data),
//     onMutate: async (newComment) => {
//       await queryClient.cancelQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       const previousQna = queryClient.getQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId));
//       if (previousQna) {
//         queryClient.setQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId), {
//           ...previousQna,
//           comments: [
//             ...previousQna.comments,
//             {
//               id: Date.now(), // 임시 ID
//               content: newComment.content,
//               writer: 'currentUser', // 실제 사용자 정보로 대체 필요
//               heartCount: 0,
//               createdDate: new Date().toISOString(),
//             },
//           ],
//           commentCount: previousQna.commentCount + 1,
//         });
//       }
//       return { previousQna };
//     },
//     onError: (error, newComment, context) => {
//       if (context?.previousQna) {
//         queryClient.setQueryData(qnaQueryKeys.qna.detail(qnaId), context.previousQna);
//       }
//       console.error(`Failed to create comment for QnA ${qnaId}:`, error.message);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//     },
//   });
// };

// // 댓글 좋아요 추가 (낙관적 업데이트 적용)
// export const useAddCommentHeart = (qnaId: number, commentId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, void, { previousQna: Qna | undefined }>({
//     mutationFn: () => qnaService.addCommentHeart(commentId),
//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       const previousQna = queryClient.getQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId));
//       if (previousQna) {
//         queryClient.setQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId), {
//           ...previousQna,
//           comments: previousQna.comments.map((comment) =>
//             comment.id === commentId
//               ? { ...comment, heartCount: comment.heartCount + 1, isHearted: true }
//               : comment
//           ),
//         });
//       }
//       return { previousQna };
//     },
//     onError: (error, variables, context) => {
//       if (context?.previousQna) {
//         queryClient.setQueryData(qnaQueryKeys.qna.detail(qnaId), context.previousQna);
//       }
//       console.error(`Failed to add heart for comment ${commentId}:`, error.message);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//     },
//   });
// };

// // 댓글 좋아요 취소 (낙관적 업데이트 적용)
// export const useRemoveCommentHeart = (qnaId: number, commentId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, void, { previousQna: Qna | undefined }>({
//     mutationFn: () => qnaService.removeCommentHeart(commentId),
//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//       const previousQna = queryClient.getQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId));
//       if (previousQna) {
//         queryClient.setQueryData<Qna>(qnaQueryKeys.qna.detail(qnaId), {
//           ...previousQna,
//           comments: previousQna.comments.map((comment) =>
//             comment.id === commentId
//               ? { ...comment, heartCount: comment.heartCount - 1, isHearted: false }
//               : comment
//           ),
//         });
//       }
//       return { previousQna };
//     },
//     onError: (error, variables, context) => {
//       if (context?.previousQna) {
//         queryClient.setQueryData(qnaQueryKeys.qna.detail(qnaId), context.previousQna);
//       }
//       console.error(`Failed to remove heart for comment ${commentId}:`, error.message);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//     },
//   });
// };

// // Q&A 게시글 이미지 추가
// export const useAddQnaImage = (qnaId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, FormData>({
//     mutationFn: (formData) => qnaService.addQnaImage(qnaId, formData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//     },
//     onError: (error) => {
//       console.error(`Failed to add image for QnA ${qnaId}:`, error.message);
//     },
//   });
// };

// // Q&A 게시글 이미지 삭제
// export const useDeleteQnaImage = (qnaId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, void>({
//     mutationFn: () => qnaService.deleteQnaImage(qnaId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: qnaQueryKeys.qna.detail(qnaId) });
//     },
//     onError: (error) => {
//       console.error(`Failed to delete image for QnA ${qnaId}:`, error.message);
//     },
//   });
// };
