import { apiClient } from '@/api/axiosConfig';
import { BlogListResponse, Blog, BlogRequest, CommentRequest, ReportRequest, BlogSort } from '@/types/blog';

// blogService 정의
export const blogService = {
  // 블로그 목록 조회
  getBlogs: async (
    id: number | undefined,
    size: number = 10,
    keyword?: string,
    sort?: BlogSort
  ): Promise<BlogListResponse> => {
    const response = await apiClient.get<BlogListResponse>('/blog', {
      params: { id, size, keyword, sort },
    });
    return response.data;
  },

  // 특정 블로그 상세 조회
  getBlogById: async (blogId: number): Promise<Blog> => {
    const response = await apiClient.get<Blog>(`/blog/${blogId}`);
    return response.data;
  },

  // 블로그 생성
  createBlog: async (data: BlogRequest): Promise<Blog> => {
    const response = await apiClient.post<Blog>('/blog', data);
    return response.data;
  },

  // 블로그 수정
  updateBlog: async (blogId: number, data: BlogRequest): Promise<Blog> => {
    const response = await apiClient.patch<Blog>(`/blog/${blogId}`, data);
    return response.data;
  },

  // 블로그 삭제
  deleteBlog: async (blogId: number): Promise<void> => {
    await apiClient.delete(`/blog/${blogId}`);
  },

  // 북마크된 블로그 목록 조회
  getBookmarkedBlogs: async (id: number | undefined, size: number = 10): Promise<BlogListResponse> => {
    const response = await apiClient.get<BlogListResponse>('/blog/bookmarks', {
      params: { id, size },
    });
    return response.data;
  },

  // 블로그 북마크 추가
  addBookmark: async (blogId: number): Promise<void> => {
    await apiClient.post(`/blog/${blogId}/bookmarks`);
  },

  // 블로그 북마크 삭제
  removeBookmark: async (blogId: number): Promise<void> => {
    await apiClient.delete(`/blog/${blogId}/bookmarks`);
  },

  // 블로그에 댓글 작성
  createComment: async (blogId: number, data: CommentRequest): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/blog/${blogId}/comment`, data);
    return response.data;
  },

  // 댓글 수정
  updateComment: async (blogId: number, commentId: number, data: CommentRequest): Promise<Comment> => {
    const response = await apiClient.patch<Comment>(`/blog/${blogId}/comment/${commentId}`, data);
    return response.data;
  },

  // 댓글 삭제
  deleteComment: async (blogId: number, commentId: number): Promise<void> => {
    await apiClient.delete(`/blog/${blogId}/comment/${commentId}`);
  },

  // 댓글에 좋아요 추가
  addCommentHeart: async (blogId: number, commentId: number): Promise<void> => {
    await apiClient.post(`/blog/${blogId}/comment/${commentId}/hearts`);
  },

  // 댓글 좋아요 삭제
  removeCommentHeart: async (blogId: number, commentId: number): Promise<void> => {
    await apiClient.delete(`/blog/${blogId}/comment/${commentId}/hearts`);
  },

  // 댓글에 답글 작성
  createReply: async (blogId: number, commentId: number, data: CommentRequest): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/blog/${blogId}/comment/${commentId}/reply`, data);
    return response.data;
  },

  // 블로그에 좋아요 추가
  addBlogHeart: async (blogId: number): Promise<void> => {
    await apiClient.post(`/blog/${blogId}/hearts`);
  },

  // 블로그 좋아요 삭제
  removeBlogHeart: async (blogId: number): Promise<void> => {
    await apiClient.delete(`/blog/${blogId}/hearts`);
  },

  // 블로그 신고
  reportBlog: async (blogId: number, data: ReportRequest): Promise<void> => {
    await apiClient.post(`/blog/${blogId}/report`, data);
  },
};
