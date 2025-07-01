import { useQuery } from '@tanstack/react-query';
import { bookmarkService } from '@/services/bookmarkService';
import type { BookmarkListResponse } from '@/types';

export const useBookmarkBlogs = () => {
  return useQuery<BookmarkListResponse, Error>({
    queryKey: ['bookmarks'],
    queryFn: () => bookmarkService.getBookmarks(),
  });
};
