import { Route, Routes, useLocation } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import render from '@/utils/test/render';
import { BlogList } from './BlogList';

const TypeCategoryLocation = () => {
  const location = useLocation();
  return <div>Type category step {location.search}</div>;
};

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual<typeof import('@/hooks')>('@/hooks');

  return {
    ...actual,
    useBlogs: () => ({
      data: {
        pages: [
          {
            data: {
              results: [],
            },
          },
        ],
      },
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isError: false,
      isFetchingNextPage: false,
      isLoading: false,
    }),
  };
});

it('routes Buddy profile CTA directly to the type-category step', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/community?tab=Buddy']}>
      <Routes>
        <Route
          path="/community"
          element={<BlogList type="BUDDY" title="Buddy profiles" onLike={vi.fn()} onBookmark={vi.fn()} />}
        />
        <Route path="/community/post/type-category" element={<TypeCategoryLocation />} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Create Buddy Profile' }));

  expect(screen.getByText('Type category step ?type=Buddy')).toBeInTheDocument();
});

it('does not show the blog empty-state box on the Buddy list', async () => {
  await render(
    <MemoryRouter initialEntries={['/community?tab=Buddy']}>
      <BlogList type="BUDDY" title="Buddy profiles" onLike={vi.fn()} onBookmark={vi.fn()} />
    </MemoryRouter>
  );

  expect(screen.queryByRole('link', { name: 'Write a blog' })).not.toBeInTheDocument();
  expect(screen.queryByText(/Be the first one to post a blog/i)).not.toBeInTheDocument();
});
