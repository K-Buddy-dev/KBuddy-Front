import { authClient } from '@/api/axiosConfig';
import { BlogRequest, CommunityDetailResponse, CommunityListResponse } from '@/types/blog';

// // blogService 정의
export const blogService = {
  //   // 블로그 목록 조회
  getBlogs: async (
    id: number | undefined,
    size: number,
    keyword?: string,
    sort?: string,
    categoryCode?: number
  ): Promise<CommunityListResponse> => {
    const response = await authClient.get<CommunityListResponse>('/blog', {
      params: {
        id,
        size,
        keyword: keyword ?? '', // keyword가 undefined일 경우 빈 문자열로 처리
        sort,
        categoryCode,
      },
    });
    return response.data;
  },

  // 특정 블로그 상세 조회
  getBlogById: async (blogId: number): Promise<CommunityDetailResponse> => {
    const response = await authClient.get<CommunityDetailResponse>(`/blog/${blogId}`);
    return response.data;
  },
  // 블로그 생성
  createBlog: async (data: BlogRequest): Promise<boolean> => {
    const formData = new FormData();

    const { images, ...blogSaveRequest } = data;
    formData.append('blogSaveRequest', JSON.stringify(blogSaveRequest));

    if (images && images.length > 0) {
      images.forEach((file) => formData.append('images', file));
    }

    const response = await authClient.post<{ data: { status: boolean } }>('/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.status === 204;
  },
  // 블로그 수정 (PATCH 방식)
  updateBlog: async (blogId: number, data: BlogRequest): Promise<boolean> => {
    const formData = new FormData();

    const { images, ...blogUpdateRequest } = data;
    formData.append('blogUpdateRequest', JSON.stringify(blogUpdateRequest));

    if (images && images.length > 0) {
      images.forEach((file) => formData.append('images', file));
    }

    const response = await authClient.patch<{ data: { status: boolean } }>(`/blog/${blogId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.status === 204;
  },
  // 블로그 삭제
  deleteBlog: async (blogId: number): Promise<boolean> => {
    const response = await authClient.delete(`/blog/${blogId}`);
    return response.status === 204;
  },
  //   // 블로그 삭제
  //   deleteBlog: async (blogId: number): Promise<void> => {
  //     await authClient.delete(`/blog/${blogId}`);
  //   },
  //   // 북마크된 블로그 목록 조회
  //   getBookmarkedBlogs: async (id: number | undefined, size: number = 10): Promise<BlogListResponse> => {
  //     const response = await authClient.get<BlogListResponse>('/blog/bookmarks', {
  //       params: { id, size },
  //     });
  //     return response.data;
  //   },
  // 블로그 북마크 추가
  addBookmark: async (blogId: number): Promise<void> => {
    await authClient.post(`/blog/${blogId}/bookmark`);
  },
  // 블로그 북마크 삭제
  removeBookmark: async (blogId: number): Promise<void> => {
    await authClient.delete(`/blog/${blogId}/unbookmark`);
  },
  // 블로그에 좋아요 추가
  addBlogHeart: async (blogId: number): Promise<void> => {
    await authClient.post(`/blog/${blogId}/hearts`);
  },
  // 블로그 좋아요 삭제
  removeBlogHeart: async (blogId: number): Promise<void> => {
    await authClient.delete(`/blog/${blogId}/hearts`);
  },
  //   // 블로그에 댓글 작성
  //   createComment: async (blogId: number, data: CommentRequest): Promise<Comment> => {
  //     const response = await authClient.post<Comment>(`/blog/${blogId}/comment`, data);
  //     return response.data;
  //   },
  //   // 댓글 수정
  //   updateComment: async (blogId: number, commentId: number, data: CommentRequest): Promise<Comment> => {
  //     const response = await authClient.patch<Comment>(`/blog/${blogId}/comment/${commentId}`, data);
  //     return response.data;
  //   },
  //   // 댓글 삭제
  //   deleteComment: async (blogId: number, commentId: number): Promise<void> => {
  //     await authClient.delete(`/blog/${blogId}/comment/${commentId}`);
  //   },
  //   // 댓글에 좋아요 추가
  //   addCommentHeart: async (blogId: number, commentId: number): Promise<void> => {
  //     await authClient.post(`/blog/${blogId}/comment/${commentId}/hearts`);
  //   },
  //   // 댓글 좋아요 삭제
  //   removeCommentHeart: async (blogId: number, commentId: number): Promise<void> => {
  //     await authClient.delete(`/blog/${blogId}/comment/${commentId}/hearts`);
  //   },
  //   // 댓글에 답글 작성
  //   createReply: async (blogId: number, commentId: number, data: CommentRequest): Promise<Comment> => {
  //     const response = await authClient.post<Comment>(`/blog/${blogId}/comment/${commentId}/reply`, data);
  //     return response.data;
  //   },

  //   // 블로그 신고
  //   reportBlog: async (blogId: number, data: ReportRequest): Promise<void> => {
  //     await authClient.post(`/blog/${blogId}/report`, data);
  //   },
};
