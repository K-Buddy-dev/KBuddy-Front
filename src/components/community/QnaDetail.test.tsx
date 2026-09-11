import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import render from '@/utils/test/render';
import { LoginPromptProvider } from '@/hooks/useLoginPrompt';
import { QnaDetail } from './QnaDetail';

const mockQnaDetail = {
  code: 'KB-HTTP-200',
  data: {
    categoryId: [0],
    commentCount: 0,
    comments: [],
    createdAt: '2026-06-06T10:00:00Z',
    description: 'How do I prepare documents for a visa appointment?',
    heartCount: 2,
    id: 1,
    images: [],
    isBookmarked: false,
    isHearted: false,
    modifiedAt: '2026-06-06T10:00:00Z',
    status: 'OPEN',
    title: 'Visa appointment document checklist',
    viewCount: 12,
    writerName: 'minji',
    writerProfileImageUrl: '',
    writerUuid: 'writer-1',
  },
  details: [],
  path: '/qna/1',
  status: 200,
  timestamp: '2026-06-06T10:00:00Z',
};

vi.mock('@/hooks', () => ({
  useAddQnaCommentHeart: () => ({ mutate: vi.fn() }),
  useCreateQnaComment: () => ({ mutate: vi.fn() }),
  useDeleteQnaComment: () => ({ mutate: vi.fn() }),
  useQnaDetail: () => ({ data: mockQnaDetail, error: null, isLoading: false }),
  useRemoveQnaCommentHeart: () => ({ mutate: vi.fn() }),
  useUpdateQnaComment: () => ({ mutate: vi.fn() }),
}));

vi.mock('./swiper', () => ({
  RecommendSwiper: () => <div>Related questions</div>,
}));

vi.mock('./CommunityContent', () => ({
  CommunityContent: ({ content }: { content: string }) => <p>{content}</p>,
}));

beforeEach(() => {
  localStorage.setItem('basicUserData', JSON.stringify({ profileImageUrl: '', uuid: 'current-user' }));
});

it('presents Q&A detail as an answer-focused question page', async () => {
  await render(
    <MemoryRouter>
      <LoginPromptProvider>
        <QnaDetail
          contentId={1}
          handleBlockUserOpen={vi.fn()}
          onBookmark={vi.fn()}
          onLike={vi.fn()}
          recommendedData={[]}
        />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(screen.getByText('Q&A')).toBeInTheDocument();
  expect(screen.getByText('Open')).toBeInTheDocument();
  expect(screen.getByText('0 answers')).toBeInTheDocument();
  expect(screen.getByText('No answers yet. Be the first to help.')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Write an answer')).toBeInTheDocument();
  expect(screen.queryByText('Save')).not.toBeInTheDocument();
});
