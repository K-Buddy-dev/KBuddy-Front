import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import render from '@/utils/test/render';
import { LoginPromptProvider } from '@/hooks/useLoginPrompt';
import { BlogDetail } from './BlogDetail';

const mockBlogDetail = {
  code: 'KB-HTTP-200',
  data: {
    categoryId: [5],
    commentCount: 0,
    comments: [],
    createdAt: '2026-06-06T10:00:00Z',
    description: 'A short guide for daily life in Korea.',
    heartCount: 4,
    id: 1,
    images: [],
    isBookmarked: false,
    isHearted: false,
    modifiedAt: '2026-06-06T10:00:00Z',
    status: 'PUBLISHED',
    title: 'Daily life tips in Seoul',
    viewCount: 15,
    writerName: 'minji',
    writerProfileImageUrl: '',
    writerUuid: 'writer-1',
  },
  details: [],
  path: '/blog/1',
  status: 200,
  timestamp: '2026-06-06T10:00:00Z',
};

vi.mock('@/hooks', () => ({
  useAddBlogCommentHeart: () => ({ mutate: vi.fn() }),
  useBlogDetail: () => ({ data: mockBlogDetail, error: null, isLoading: false }),
  useCreateBlogComment: () => ({ mutate: vi.fn() }),
  useDeleteBlogComment: () => ({ mutate: vi.fn() }),
  useRemoveBlogCommentHeart: () => ({ mutate: vi.fn() }),
  useUpdateBlogComment: () => ({ mutate: vi.fn() }),
}));

vi.mock('./swiper', () => ({
  RecommendSwiper: () => <div>Recommended carousel</div>,
}));

vi.mock('./CommunityContent', () => ({
  CommunityContent: ({ content }: { content: string }) => <p>{content}</p>,
}));

beforeEach(() => {
  localStorage.setItem('basicUserData', JSON.stringify({ profileImageUrl: '', uuid: 'current-user' }));
});

it('presents blog detail as an article while keeping comments wording', async () => {
  await render(
    <MemoryRouter>
      <LoginPromptProvider>
        <BlogDetail
          contentId={1}
          handleBlockUserOpen={vi.fn()}
          onBookmark={vi.fn()}
          onLike={vi.fn()}
          recommendedData={[]}
        />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(screen.getByText('Article')).toBeInTheDocument();
  expect(screen.getByText('Article').closest('section')).toHaveClass('pt-4');
  expect(screen.getByText('Daily Life')).toBeInTheDocument();
  expect(screen.getByText('0 comments')).toBeInTheDocument();
  expect(screen.getByText('Comments')).toBeInTheDocument();
  expect(screen.getByText('No comments yet. Start the conversation.')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Write a comment')).toBeInTheDocument();
  expect(screen.getByText('Related posts')).toBeInTheDocument();
});
