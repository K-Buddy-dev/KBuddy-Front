import { useCallback } from 'react';
import {
  useAddBlogHeart,
  useAddBlogBookmark,
  useAddQnaHeart,
  useAddQnaBookmark,
  useRemoveBlogHeart,
  useRemoveBlogBookmark,
  useRemoveQnaHeart,
  useRemoveQnaBookmark,
} from '@/hooks';

interface ContentActionProps {
  contentType: 'blog' | 'qna';
  refetchRecommended?: () => void;
}

export const useContentActions = ({ contentType, refetchRecommended }: ContentActionProps) => {
  const addBlogHeart = useAddBlogHeart();
  const removeBlogHeart = useRemoveBlogHeart();
  const addBlogBookmark = useAddBlogBookmark();
  const removeBlogBookmark = useRemoveBlogBookmark();
  const addQnaHeart = useAddQnaHeart();
  const removeQnaHeart = useRemoveQnaHeart();
  const addQnaBookmark = useAddQnaBookmark();
  const removeQnaBookmark = useRemoveQnaBookmark();

  const handleLike = useCallback(
    (event: React.MouseEvent, contentId: number, isHearted: boolean) => {
      event.stopPropagation();
      const isBlog = contentType === 'blog';
      const addHeart = isBlog ? addBlogHeart : addQnaHeart;
      const removeHeart = isBlog ? removeBlogHeart : removeQnaHeart;

      if (isHearted) {
        removeHeart.mutate(contentId, {
          onSuccess: refetchRecommended,
          onError: (error) => alert(`Fail remove Like: ${error.message}`),
        });
      } else {
        addHeart.mutate(contentId, {
          onSuccess: refetchRecommended,
          onError: (error) => alert(`Fail add Like: ${error.message}`),
        });
      }
    },
    [contentType, addBlogHeart, addQnaHeart, removeBlogHeart, removeQnaHeart, refetchRecommended]
  );

  const handleBookmark = useCallback(
    (event: React.MouseEvent, contentId: number, isBookmarked: boolean) => {
      event.stopPropagation();
      const isBlog = contentType === 'blog';
      const addBookmark = isBlog ? addBlogBookmark : addQnaBookmark;
      const removeBookmark = isBlog ? removeBlogBookmark : removeQnaBookmark;

      if (isBookmarked) {
        removeBookmark.mutate(contentId, {
          onSuccess: refetchRecommended,
          onError: (error) => alert(`Fail remove Bookmark: ${error.message}`),
        });
      } else {
        addBookmark.mutate(contentId, {
          onSuccess: refetchRecommended,
          onError: (error) => alert(`Fail add Bookmark: ${error.message}`),
        });
      }
    },
    [contentType, addBlogBookmark, addQnaBookmark, removeBlogBookmark, removeQnaBookmark, refetchRecommended]
  );

  return { handleLike, handleBookmark };
};
