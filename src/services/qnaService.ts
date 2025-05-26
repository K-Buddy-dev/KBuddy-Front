import { authClient } from '@/api/axiosConfig';
import { BlogRequest, CommentRequest, CommunityDetailResponse, CommunityListResponse } from '@/types/community';

export const qnaService = {
  getQnas: async (
    id: number | undefined,
    size: number,
    keyword?: string,
    sort?: string,
    categoryCode?: number
  ): Promise<CommunityListResponse> => {
    const response = await authClient.get<CommunityListResponse>('/qna', {
      params: {
        id,
        size,
        keyword: keyword ?? '',
        sort,
        categoryCode,
      },
    });
    return response.data;
  },

  // 특정 Q&A 상세 조회
  getQnaById: async (qnaId: number): Promise<CommunityDetailResponse> => {
    const response = await authClient.get<CommunityDetailResponse>(`/qna/${qnaId}`);
    return response.data;
  },
  // Q&A 생성
  createQna: async (data: BlogRequest): Promise<boolean> => {
    const formData = new FormData();

    const { images, ...qnaSaveRequest } = data;
    formData.append('qnaSaveRequest', JSON.stringify(qnaSaveRequest));

    if (images && images.length > 0) {
      images.forEach((file) => formData.append('images', file));
    }

    const response = await authClient.post<{ data: { status: boolean } }>('/qna', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.status === 204;
  },
  // Q&A 수정 (PATCH 방식)
  updateQna: async (qnaId: number, data: BlogRequest): Promise<boolean> => {
    const formData = new FormData();

    const { images, ...qnaUpdateRequest } = data;
    formData.append('qnaUpdateRequest', JSON.stringify(qnaUpdateRequest));

    if (images && images.length > 0) {
      images.forEach((file) => formData.append('images', file));
    }

    const response = await authClient.patch<{ data: { status: boolean } }>(`/qna/${qnaId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.status === 204;
  },
  // Q&A 삭제
  deleteQna: async (qnaId: number): Promise<boolean> => {
    const response = await authClient.delete(`/qna/${qnaId}`);
    return response.status === 204;
  },
  //   // 북마크된 Q&A 목록 조회
  //   getBookmarkedQnas: async (id: number | undefined, size: number = 10): Promise<QnaListResponse> => {
  //     const response = await authClient.get<QnaListResponse>('/qna/bookmarks', {
  //       params: { id, size },
  //     });
  //     return response.data;
  //   },
  // Q&A 북마크 추가
  addBookmark: async (qnaId: number): Promise<void> => {
    await authClient.post(`/qna/${qnaId}/bookmark`);
  },
  // Q&A 북마크 삭제
  removeBookmark: async (qnaId: number): Promise<void> => {
    await authClient.delete(`/qna/${qnaId}/unbookmark`);
  },
  // Q&A에 좋아요 추가
  addQnaHeart: async (qnaId: number): Promise<void> => {
    await authClient.post(`/qna/${qnaId}/hearts`);
  },
  // Q&A 좋아요 삭제
  removeQnaHeart: async (qnaId: number): Promise<void> => {
    await authClient.delete(`/qna/${qnaId}/hearts`);
  },
  // Q&A에 댓글 작성
  createComment: async (qnaId: number, data: CommentRequest): Promise<boolean> => {
    const response = await authClient.post<Comment>(`/qna/${qnaId}/comment`, data);
    return response.status === 204;
  },
  // 댓글 수정
  updateComment: async (qnaId: number, commentId: number, data: { content: string }): Promise<boolean> => {
    const response = await authClient.put<Comment>(`/qna/${qnaId}/comment/${commentId}`, data);
    return response.status === 204;
  },
  // 댓글 삭제
  deleteComment: async (commentId: number): Promise<boolean> => {
    const response = await authClient.delete(`/qna/comment/${commentId}`);
    return response.status === 204;
  },
  // 댓글에 좋아요 추가
  addCommentHeart: async (commentId: number): Promise<void> => {
    await authClient.post(`/qna/comment/${commentId}/hearts`);
  },
  // 댓글 좋아요 삭제
  removeCommentHeart: async (commentId: number): Promise<void> => {
    await authClient.delete(`/qna/comment/${commentId}/hearts`);
  },

  //   // Q&A 신고
  //   reportQna: async (qnaId: number, data: ReportRequest): Promise<void> => {
  //     await authClient.post(`/qna/${qnaId}/report`, data);
  //   },
};
