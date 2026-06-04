import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import render from '@/utils/test/render';
import { useBookmarkBlogs, useContentActions } from '@/hooks';
import { BookmarkList } from './BookmarkList';

vi.mock('@/hooks', () => ({
  useBookmarkBlogs: vi.fn(),
  useContentActions: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useContentActions).mockReturnValue({
    handleBookmark: vi.fn(),
    handleLike: vi.fn(),
  } as any);
});

it('shows a saved posts prompt when there are no saved items', async () => {
  vi.mocked(useBookmarkBlogs).mockReturnValue({
    data: {
      code: null,
      data: [],
      details: [],
      path: null,
      status: 200,
      timestamp: '2026-05-30T00:00:00Z',
    },
    error: null,
    isError: false,
    isLoading: false,
  } as any);

  await render(
    <MemoryRouter>
      <BookmarkList />
    </MemoryRouter>
  );

  expect(screen.getByText("There aren't any saved posts yet.")).toBeInTheDocument();
  expect(screen.getByText('Save posts you want to revisit, and they will appear here.')).toBeInTheDocument();
});
