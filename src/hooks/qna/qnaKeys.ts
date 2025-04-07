export const blogQueryKeys = {
  one: ['blog'] as const,
  all: ['blogs'] as const,
  bookmarks: ['blogBookmarks'] as const,

  blog: {
    // 블로그 단건
    detail: (blogId: number) => [...blogQueryKeys.one, blogId] as const,

    // 블로그 목록 조회 (필터링 조건 포함)
    list: (filters: { cursor?: number; size?: number; keyword?: string; sort?: string }) =>
      [...blogQueryKeys.all, filters] as const,

    // 북마크된 블로그 목록 조회
    bookmarked: (filters: { cursor?: number; size?: number }) => [...blogQueryKeys.bookmarks, filters] as const,
  },
};
