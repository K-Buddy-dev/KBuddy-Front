import { authClient } from '@/api/axiosConfig';
import { BookmarkListResponse } from '@/types';

export const bookmarkService = {
  // 북마크 게시글 목록 조회
  async getBookmarks(): Promise<BookmarkListResponse> {
    const response = await authClient.get('/user/bookmarks');
    return response.data;
  },
};
