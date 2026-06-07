import { act, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import render from '@/utils/test/render';
import { ToastProvider } from '@/hooks/useToastContext';
import { counselorService } from '@/services/counselorService';
import { analyticsService } from '@/services/analyticsService';
import { ServiceDetailPage } from './ServiceDetailPage';

vi.mock('@/services/counselorService', () => ({
  counselorService: {
    deleteProfile: vi.fn(),
    getCounselorDetail: vi.fn(),
    getCounselorInquiryDetail: vi.fn(),
    getCounselorInquiries: vi.fn(),
    getCounselorReviews: vi.fn(),
    createCounselorInquiry: vi.fn(),
    replyToCounselorInquiry: vi.fn(),
  },
}));

vi.mock('@/services/analyticsService', () => ({
  analyticsService: {
    trackEvent: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.mocked(counselorService.getCounselorDetail).mockResolvedValue({
    categories: ['생활', '비자'],
    counselorId: '9',
    counselorUserUuid: 'user-9',
    coverImageUrl: 'https://example.com/detail.jpg',
    detail: 'API counselor detail.',
    id: '9',
    intro: 'Hello',
    inquiries: [
      {
        createdAt: '2026-05-25T10:00:00Z',
        inquiryId: 7,
        isSecret: false,
        title: '상세 응답 문의',
        writerName: 'Jane',
      },
    ],
    name: '홍길동',
    photoUrls: ['https://example.com/photo-1.jpg', 'https://example.com/photo-2.jpg'],
    professionalBackground: '10 years',
    profileImageUrl: 'https://example.com/profile.jpg',
    proofFileUrl: 'https://example.com/proof.pdf',
    ratingAvg: 4.8,
    recentReviews: [],
    regularPrice: 30000,
    reviewCount: 12,
    sessionMinutes: 50,
    timezone: 'Asia/Seoul',
    title: 'API counselor detail title',
  });
  vi.mocked(counselorService.getCounselorReviews).mockResolvedValue({
    reviews: [
      {
        comment: '정말 도움이 됐습니다.',
        createdAt: '2026-05-25T10:00:00Z',
        customerName: 'John',
        rating: 5,
        reviewId: 1,
      },
    ],
    totalCount: 42,
  });
  vi.mocked(counselorService.getCounselorInquiries).mockResolvedValue({
    inquiries: [
      {
        createdAt: '2026-05-25T10:00:00Z',
        inquiryId: 1,
        isSecret: false,
        title: '상담 가능 시간 문의',
        writerName: 'John',
      },
    ],
    totalCount: 10,
  });
  vi.mocked(counselorService.getCounselorInquiryDetail).mockResolvedValue({
    content: '주말 상담도 가능한가요?',
    createdAt: '2026-05-25T10:00:00Z',
    inquiryId: 1,
    isSecret: false,
    replies: [
      {
        authorName: 'Jane',
        content: '네, 주말도 가능합니다.',
        createdAt: '2026-05-25T11:00:00Z',
        replyId: 1,
      },
    ],
    title: '상담 가능 시간 문의',
    writerName: 'John',
  });
  vi.mocked(counselorService.createCounselorInquiry).mockResolvedValue();
  vi.mocked(counselorService.replyToCounselorInquiry).mockResolvedValue();
  vi.mocked(counselorService.deleteProfile).mockResolvedValue();
});

it('renders counselor profile data passed from my sale instead of static mock data', async () => {
  await render(
    <ToastProvider>
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/service/42',
            state: {
              service: {
                categories: ['Restaurant', 'Cafe/Dessert'],
                coverImageUrl: 'https://example.com/cover.jpg',
                detail: 'My real counselor detail.',
                id: '42',
                name: 'Hong',
                photoUrls: [],
                profileImageUrl: 'https://example.com/profile.jpg',
                recentReviews: [
                  { comment: 'Great', createdAt: '2026-05-20T10:00:00', customerName: 'Kim', id: 1, rating: 5 },
                ],
                regularPrice: 30000,
                reviewCount: 1,
                sessionMinutes: 30,
                timezone: 'Asia/Seoul',
                title: 'My real counselor service',
              },
            },
          },
        ]}
      >
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );

  expect(screen.getAllByText('My real counselor service').length).toBeGreaterThan(0);
  expect(screen.getByText('@Hong')).toBeInTheDocument();
  expect(screen.getByText('Restaurant | Cafe/Dessert')).toBeInTheDocument();
  expect(screen.getByText('My real counselor detail.')).toBeInTheDocument();
  expect(screen.getAllByText('30,000 won')[0]).toBeInTheDocument();
  expect(screen.getAllByText('30 min')[0]).toBeInTheDocument();
  expect(screen.queryByText('Live chat assistance for finding a job in Seoul')).not.toBeInTheDocument();
});

it('opens the service detail menu when the hamburger menu is clicked', async () => {
  const { user } = await render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/service/1']}>
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
  await act(async () => {});

  await user.click(await screen.findByRole('button', { name: 'menu' }));

  expect(screen.getByText('Report this service')).toBeInTheDocument();
});

it('loads service detail from the counselor detail API by route id', async () => {
  await render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/service/9']}>
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
  await act(async () => {});

  expect(await screen.findAllByText('API counselor detail title')).toHaveLength(2);
  expect(screen.getByText('@홍길동')).toBeInTheDocument();
  expect(screen.getByText('API counselor detail.')).toBeInTheDocument();
  expect(screen.getByAltText('Gallery 1')).toHaveAttribute('src', 'https://example.com/photo-1.jpg');
  expect(screen.getByAltText('Gallery 2')).toHaveAttribute('src', 'https://example.com/photo-2.jpg');
  expect(screen.queryByText('0 photos')).not.toBeInTheDocument();
  expect(screen.getByText('상세 응답 문의')).toBeInTheDocument();
  expect(screen.getByText('1 inquiries')).toBeInTheDocument();
  expect(counselorService.getCounselorDetail).toHaveBeenCalledWith('9');
});

it('navigates to the service list when backTo state is provided', async () => {
  const { user } = await render(
    <ToastProvider>
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/service/9',
            state: { backTo: '/service' },
          },
        ]}
      >
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
          <Route path="/service" element={<div>Service list route</div>} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
  await act(async () => {});

  await user.click(await screen.findByRole('button', { name: 'Back' }));

  expect(screen.getByText('Service list route')).toBeInTheDocument();
});

it('loads reviews from the counselor review API when the review tab is clicked', async () => {
  const { user } = await render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/service/9']}>
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
  await act(async () => {});

  await user.click(await screen.findByRole('button', { name: 'Review' }));

  expect(counselorService.getCounselorReviews).toHaveBeenCalledWith('9', { page: 0, size: 20 });
  expect(await screen.findByText('@ John')).toBeInTheDocument();
  expect(screen.getByText('정말 도움이 됐습니다.')).toBeInTheDocument();
  expect(screen.getByText('(42 reviews)')).toBeInTheDocument();
  expect(screen.queryByText('A must-see icon of seoul: namsan tower delights visitors.')).not.toBeInTheDocument();
});

it('loads inquiries from the counselor inquiry API when the inquiry tab is clicked', async () => {
  const { user } = await render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/service/9']}>
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
  await act(async () => {});

  await user.click(await screen.findByRole('button', { name: 'Inquiry' }));

  expect(counselorService.getCounselorInquiries).toHaveBeenCalledWith('9', { page: 0, size: 20 });
  expect(await screen.findByText('상담 가능 시간 문의')).toBeInTheDocument();
  expect(screen.getByText('@John')).toBeInTheDocument();
  expect(screen.getByText('10 inquiries')).toBeInTheDocument();
  expect(
    screen.queryByText('Lorem ipsum dolor sit amet consectetur. Suscipit non est sit a volutpat in.')
  ).not.toBeInTheDocument();
});

it('opens the inquiry tab from the service detail query string', async () => {
  await render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/service/9?tab=Inquiry']}>
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );

  expect(await screen.findByRole('button', { name: 'Inquiry' })).toHaveClass('flex-shrink-0');
  expect(counselorService.getCounselorInquiries).toHaveBeenCalledWith('9', { page: 0, size: 20 });
  expect(await screen.findByText('상담 가능 시간 문의')).toBeInTheDocument();
});

it('loads inquiry detail and posts a reply from the inquiry tab', async () => {
  const { user } = await render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/service/9']}>
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
  await act(async () => {});

  await user.click(await screen.findByRole('button', { name: 'Inquiry' }));
  await user.click(await screen.findByRole('button', { name: '상담 가능 시간 문의' }));

  expect(counselorService.getCounselorInquiryDetail).toHaveBeenCalledWith('9', 1);
  expect(await screen.findByText('주말 상담도 가능한가요?')).toBeInTheDocument();
  expect(screen.getByText('네, 주말도 가능합니다.')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Reply' }));
  await user.type(screen.getByPlaceholderText('Write a reply'), '가능합니다.');
  await user.click(screen.getByRole('button', { name: 'Post reply' }));

  expect(counselorService.replyToCounselorInquiry).toHaveBeenCalledWith('9', 1, '가능합니다.');
  expect(counselorService.getCounselorInquiryDetail).toHaveBeenCalledTimes(2);
});

it('opens an inquiry form from ask the seller and creates an inquiry', async () => {
  const { user } = await render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/service/9']}>
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
  await act(async () => {});

  await user.click(await screen.findByRole('button', { name: 'Inquiry' }));
  await user.click(await screen.findByRole('button', { name: 'Ask the seller' }));

  expect(await screen.findByRole('dialog')).toBeInTheDocument();

  await user.type(screen.getByLabelText('Title'), '상담 가능 시간 문의');
  await user.type(screen.getByLabelText('Content'), '주말 상담도 가능한가요?');
  await user.click(screen.getByLabelText('Secret inquiry'));
  await user.click(screen.getByRole('button', { name: 'Submit inquiry' }));

  expect(counselorService.createCounselorInquiry).toHaveBeenCalledWith('9', {
    content: '주말 상담도 가능한가요?',
    isSecret: true,
    title: '상담 가능 시간 문의',
  });
  expect(counselorService.getCounselorInquiries).toHaveBeenLastCalledWith('9', { page: 0, size: 20 });
});

it('shows a popup instead of navigating when requesting my own counselor profile', async () => {
  localStorage.setItem('basicUserData', JSON.stringify({ userId: 'legacy-id', uuid: 'user-9' }));

  const { user } = await render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/service/9']}>
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
          <Route path="/service/:id/request" element={<div>Request route</div>} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
  await act(async () => {});

  await user.click(await screen.findByRole('button', { name: 'Request' }));

  expect(analyticsService.trackEvent).not.toHaveBeenCalledWith('service_request_started', expect.anything());
  expect(await screen.findByRole('alert')).toHaveTextContent('You cannot request your own counselor profile.');
  expect(screen.queryByText('Request route')).not.toBeInTheDocument();
});

it('tracks when a customer starts a service request', async () => {
  const { user } = await render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/service/9']}>
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
          <Route path="/service/:id/request" element={<div>Request route</div>} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
  await act(async () => {});

  await user.click(await screen.findByRole('button', { name: 'Request' }));

  expect(analyticsService.trackEvent).toHaveBeenCalledWith('service_request_started', {
    counselor_id: '9',
  });
  expect(screen.getByText('Request route')).toBeInTheDocument();
});

it('shows edit and delete menu items for my own counselor profile', async () => {
  localStorage.setItem('basicUserData', JSON.stringify({ userId: 'legacy-id', uuid: 'user-9' }));

  const { user } = await render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/service/9']}>
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
  await act(async () => {});

  await user.click(await screen.findByRole('button', { name: 'menu' }));

  expect(screen.queryByText('Report this service')).not.toBeInTheDocument();
  expect(screen.getByText('Edit this content')).toBeInTheDocument();
  expect(screen.getByText('Delete this content')).toBeInTheDocument();
});

it('shows edit and delete menu items when counselorUserUuid owns a service listing id', async () => {
  localStorage.setItem('basicUserData', JSON.stringify({ userId: 'legacy-id', uuid: 'owner-uuid' }));
  vi.mocked(counselorService.getCounselorDetail).mockResolvedValueOnce({
    categories: ['Visa'],
    counselorId: 'profile-uuid',
    counselorUserUuid: 'owner-uuid',
    coverImageUrl: 'https://example.com/detail.jpg',
    detail: 'Owned service detail.',
    id: 'listing-99',
    intro: 'Hello',
    name: 'Owner',
    photoUrls: [],
    profileImageUrl: 'https://example.com/profile.jpg',
    ratingAvg: 4.8,
    recentReviews: [],
    regularPrice: 30000,
    reviewCount: 0,
    sessionMinutes: 50,
    timezone: 'Asia/Seoul',
    title: 'Owned service',
  });

  const { user } = await render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/service/listing-99']}>
        <Routes>
          <Route path="/service/:id" element={<ServiceDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
  await act(async () => {});

  await user.click(await screen.findByRole('button', { name: 'menu' }));

  expect(screen.queryByText('Report this service')).not.toBeInTheDocument();
  expect(screen.getByText('Edit this content')).toBeInTheDocument();
  expect(screen.getByText('Delete this content')).toBeInTheDocument();
});
