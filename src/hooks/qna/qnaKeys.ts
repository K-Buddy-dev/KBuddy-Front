import { BlogFilters } from '@/types';

export const qnaQueryKeys = {
  one: ['qna'] as const,
  all: ['qnas'] as const,
  bookmarks: ['qnaBookmarks'] as const,

  qna: {
    // QnA 단건
    detail: (qnaId: number) => [...qnaQueryKeys.one, qnaId] as const,

    // QnA 목록 조회 (필터링 조건 포함)
    list: (filters: BlogFilters) => [...qnaQueryKeys.all, filters] as const,

    // 북마크된 QnA 목록 조회
    bookmarked: (filters: { cursor?: number; size?: number }) => [...qnaQueryKeys.bookmarks, filters] as const,
  },
};
