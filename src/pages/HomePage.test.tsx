import { fireEvent, screen } from '@testing-library/react';
import { LoginPromptProvider } from '@/hooks/useLoginPrompt';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import render from '@/utils/test/render';
import { HomePage } from './HomePage';
import { authService } from '@/services';
import { notificationService } from '@/services/notificationService';

vi.mock('@/components/community/swiper', () => ({
  SwiperList: vi.fn(() => (
    <section aria-label="Featured posts">
      <h2>Featured posts</h2>
    </section>
  )),
}));

vi.mock('@/hooks', () => ({
  useContentActions: vi.fn(() => ({
    handleBookmark: vi.fn(),
    handleLike: vi.fn(),
  })),
  useFeaturedBlogs: vi.fn(() => ({
    data: { data: { results: [] } },
    refetch: vi.fn(),
  })),
}));

vi.mock('@/hooks/useFcmToken', () => ({
  useSendFcmTokenToServer: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

vi.mock('@/services', () => ({
  authService: {
    getUserProfile: vi.fn(),
  },
}));

vi.mock('@/services/notificationService', () => ({
  notificationService: {
    getUnreadCount: vi.fn(),
  },
}));

beforeEach(() => {
  vi.mocked(authService.getUserProfile).mockResolvedValue({ data: { userId: 'user-1' } });
  vi.mocked(notificationService.getUnreadCount).mockResolvedValue(0);
});

it('promotes becoming a counselor from the home page', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<div>My sale route</div>} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: 'Become a K-Buddy counselor' })).toBeInTheDocument();
  expect(
    screen.getByText('Share your experience, set your own schedule, and earn from live consultations.')
  ).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Become a counselor' }));

  expect(screen.getByText('My sale route')).toBeInTheDocument();
});

it('orders the home sections around featured posts and discovery', async () => {
  await render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <HomePage />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  const discovery = screen.getByRole('heading', { name: 'Discovery' });
  const problemEntry = screen.getByRole('heading', { name: 'What do you need help with in Korea?' });
  const promoBanner = screen.getByText('First consultation made easier');
  const featuredPosts = screen.getByRole('heading', { name: 'Featured posts' });
  const counselorCta = screen.getByRole('heading', { name: 'Become a K-Buddy counselor' });
  const sponsoredAd = screen.getByRole('heading', { name: '30-Day Unlimited Data SIM for Korea' });

  expect(discovery.compareDocumentPosition(problemEntry)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(problemEntry.compareDocumentPosition(promoBanner)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(promoBanner.compareDocumentPosition(featuredPosts)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(featuredPosts.compareDocumentPosition(counselorCta)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(counselorCta.compareDocumentPosition(sponsoredAd)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});

it('replaces recommended counselors with a sponsored ad section at the bottom', async () => {
  await render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <HomePage />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(screen.queryByRole('heading', { name: 'Recommended counselors' })).not.toBeInTheDocument();
  expect(screen.getByText('Sponsored by KKday')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: '30-Day Unlimited Data SIM for Korea' })).toBeInTheDocument();
  expect(
    screen.getByText('Stay connected with unlimited data and local calls for 30 days. Pick up your SIM in Korea.')
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Advertise with K-Buddy/i })).toBeInTheDocument();
});

it('uses one vertical spacing rule between home sections', async () => {
  await render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <HomePage />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(screen.getByRole('main')).toHaveClass('space-y-5', 'pt-4');
});

it('shows discovery carousel cards and filters them by type', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <HomePage />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  const discoveryCarousel = screen.getByRole('region', { name: 'Discovery carousel' });
  expect(discoveryCarousel).toHaveClass('overflow-x-auto');
  expect(discoveryCarousel).toHaveClass('touch-pan-x');
  expect(discoveryCarousel).toHaveClass('snap-x');
  expect(discoveryCarousel).not.toHaveClass('-mx-5');
  expect(discoveryCarousel).not.toHaveClass('px-5');
  expect(discoveryCarousel).toHaveClass('[scrollbar-width:none]');
  expect(discoveryCarousel).toHaveClass('[&::-webkit-scrollbar]:hidden');
  expect(screen.getByRole('button', { name: /New to Korea\? Start here/i })).toHaveClass('w-[78%]');
  expect(screen.getByRole('button', { name: /New to Korea\? Start here/i })).toHaveClass('max-w-[320px]');
  expect(
    screen
      .getByRole('button', { name: 'ALL' })
      .compareDocumentPosition(screen.getByRole('region', { name: 'Discovery carousel' }))
  ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(screen.getByText('New to Korea? Start here')).toBeInTheDocument();
  expect(screen.getByText('June live chat week')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Notice' }));

  expect(screen.getByText('New to Korea? Start here')).toBeInTheDocument();
  expect(screen.queryByText('June live chat week')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Notice' })).toHaveAttribute('aria-pressed', 'true');
});

it('opens a discovery detail page when a discovery card is clicked', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/discovery/:id" element={<div>Discovery detail route</div>} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: /New to Korea\? Start here/i }));

  expect(screen.getByText('Discovery detail route')).toBeInTheDocument();
});

it('keeps service category chips on a horizontal swipe rail', async () => {
  await render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <HomePage />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  const serviceCategoryRail = screen.getByRole('region', { name: 'Service categories' });

  expect(serviceCategoryRail).toHaveClass('overflow-x-auto');
  expect(serviceCategoryRail).toHaveClass('touch-pan-x');
  expect(serviceCategoryRail).toHaveClass('overscroll-x-contain');
  expect(serviceCategoryRail).not.toHaveClass('-mx-5');
  expect(serviceCategoryRail).not.toHaveClass('px-5');
  expect(serviceCategoryRail).toHaveClass('[scrollbar-width:none]');
  expect(serviceCategoryRail).toHaveClass('[&::-webkit-scrollbar]:hidden');
  expect(screen.getByRole('button', { name: 'Healthcare' })).toHaveClass('snap-start');
});

it('scrolls home horizontal rails by pointer dragging', async () => {
  await render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <HomePage />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  const discoveryCarousel = screen.getByRole('region', { name: 'Discovery carousel' });
  const serviceCategoryRail = screen.getByRole('region', { name: 'Service categories' });

  fireEvent.mouseDown(discoveryCarousel, { clientX: 240 });
  fireEvent.mouseMove(discoveryCarousel, { clientX: 140 });
  fireEvent.mouseUp(discoveryCarousel);

  fireEvent.mouseDown(serviceCategoryRail, { clientX: 220 });
  fireEvent.mouseMove(serviceCategoryRail, { clientX: 120 });
  fireEvent.mouseUp(serviceCategoryRail);

  expect(discoveryCarousel.scrollLeft).toBe(100);
  expect(serviceCategoryRail.scrollLeft).toBe(100);
});

it('opens service search from a problem chip', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/service" element={<div>Service route</div>} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Healthcare' }));

  expect(screen.getByText('Service route')).toBeInTheDocument();
});
