import { act, screen } from '@testing-library/react';
import { LoginPromptProvider } from '@/hooks/useLoginPrompt';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import render from '@/utils/test/render';
import { counselorService } from '@/services/counselorService';
import { bookingService } from '@/services/bookingService';
import { chatService } from '@/services/chatService';
import { ProfilePage } from './ProfilePage';

vi.mock('@/services', () => ({
  authService: {
    getUserProfile: vi.fn().mockResolvedValue({
      data: {
        userId: 'seller',
        profileImageUrl: null,
        bio: 'Bio goes here.',
      },
    }),
  },
}));

vi.mock('@/services/counselorService', () => ({
  counselorService: {
    getMyProfile: vi.fn(),
  },
}));

vi.mock('@/services/bookingService', () => ({
  bookingService: {
    getCounselorBookings: vi.fn(),
    getMyBookings: vi.fn(),
  },
}));

vi.mock('@/services/chatService', () => ({
  chatService: {
    getRoomByBooking: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(counselorService.getMyProfile).mockRejectedValue({ response: { status: 400 } });
  vi.mocked(bookingService.getCounselorBookings).mockResolvedValue([]);
  vi.mocked(bookingService.getMyBookings).mockResolvedValue([]);
  vi.mocked(chatService.getRoomByBooking).mockResolvedValue({
    name: 'Chat room',
    roomId: 'room-1',
  });
});

it('navigates from my sale to counselor profile creation', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/profile?tab=My%20sale']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/counselor/create" element={<div>Create counselor profile route</div>} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText('@seller')).toBeInTheDocument();
  await act(async () => {
    await user.click(screen.getByRole('button', { name: 'Create counselor profile' }));
  });

  expect(screen.getByText('Create counselor profile route')).toBeInTheDocument();
});

it('shows my counselor profile in my sale and blocks creating another profile', async () => {
  vi.mocked(counselorService.getMyProfile).mockResolvedValue({
    categories: ['Restaurant', 'Cafe/Dessert'],
    coverImageUrl: 'https://example.com/cover.jpg',
    detail: '1:1 live chat detail.',
    id: '1',
    name: 'Hong',
    photoUrls: [],
    professionalBackground: '10 years of experience.',
    profileImageUrl: 'https://example.com/profile.jpg',
    proofFileUrl: 'https://example.com/proof.pdf',
    recentReviews: [],
    regularPrice: 30000,
    reviewCount: 12,
    sessionMinutes: 30,
    timezone: 'Asia/Seoul',
    title: 'Seoul food counselor',
  });

  const { user } = await render(
    <MemoryRouter initialEntries={['/profile?tab=My%20sale']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/counselor/create" element={<div>Create counselor profile route</div>} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText('@seller')).toBeInTheDocument();
  expect(await screen.findByText('Seoul food counselor')).toBeInTheDocument();
  expect(screen.getByAltText('Seoul food counselor')).toHaveAttribute('src', 'https://example.com/cover.jpg');
  expect(screen.getByText('Restaurant, Cafe/Dessert')).toBeInTheDocument();
  expect(screen.getByText('1:1 Chat')).toBeInTheDocument();
  expect(screen.getByText('@Hong')).toBeInTheDocument();
  expect(screen.getByText('30 min')).toBeInTheDocument();
  expect(screen.getByText('30,000 won')).toBeInTheDocument();

  await act(async () => {
    await user.click(screen.getByRole('button', { name: 'Create counselor profile' }));
  });

  expect(await screen.findByRole('dialog')).toHaveTextContent('You have already created a counselor profile.');
  expect(screen.queryByText('Create counselor profile route')).not.toBeInTheDocument();
});

it('shows sales and listings submenus under my sale', async () => {
  vi.mocked(counselorService.getMyProfile).mockResolvedValue({
    categories: ['Restaurant'],
    coverImageUrl: 'https://example.com/cover.jpg',
    detail: '1:1 live chat detail.',
    id: '1',
    name: 'Hong',
    photoUrls: [],
    professionalBackground: '10 years of experience.',
    profileImageUrl: 'https://example.com/profile.jpg',
    proofFileUrl: 'https://example.com/proof.pdf',
    recentReviews: [],
    regularPrice: 30000,
    reviewCount: 12,
    sessionMinutes: 30,
    timezone: 'Asia/Seoul',
    title: 'Seoul food counselor',
  });

  const { user } = await render(
    <MemoryRouter initialEntries={['/profile?tab=My%20sale']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText('Seoul food counselor')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sales' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Listings' })).toHaveAttribute('aria-pressed', 'false');

  await act(async () => {
    await user.click(screen.getByRole('button', { name: 'Listings' }));
  });

  expect(screen.getByRole('button', { name: 'Sales' })).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByRole('button', { name: 'Listings' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.queryByText('Seoul food counselor')).not.toBeInTheDocument();
  expect(screen.getByText("There aren't any listings to manage at this moment.")).toBeInTheDocument();

  await act(async () => {
    await user.click(screen.getByRole('button', { name: 'Sales' }));
  });

  expect(screen.getByRole('button', { name: 'Sales' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Listings' })).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByText('Seoul food counselor')).toBeInTheDocument();
});

it('shows the empty post gray box under my post', async () => {
  await render(
    <MemoryRouter initialEntries={['/profile?tab=My%20post']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(await screen.findByRole('link', { name: 'Write a blog' })).toHaveAttribute('href', '/community/post');
  expect(screen.getByText(/There aren.t any user blogs available to view./)).toBeInTheDocument();
  expect(screen.getByText(/Be the first one to post a blog!/)).toBeInTheDocument();
});

it('opens the booking detail from counselor listings', async () => {
  vi.mocked(counselorService.getMyProfile).mockResolvedValue({
    categories: ['Restaurant'],
    coverImageUrl: 'https://example.com/cover.jpg',
    detail: '1:1 live chat detail.',
    id: '1',
    name: 'Hong',
    photoUrls: [],
    professionalBackground: '10 years of experience.',
    profileImageUrl: 'https://example.com/profile.jpg',
    proofFileUrl: 'https://example.com/proof.pdf',
    recentReviews: [],
    regularPrice: 30000,
    reviewCount: 12,
    sessionMinutes: 30,
    timezone: 'Asia/Seoul',
    title: 'Seoul food counselor',
  });
  vi.mocked(bookingService.getCounselorBookings).mockResolvedValue([
    {
      birthDate: '2000-07-24',
      bookingEndUtc: '2026-06-01T01:30:00Z',
      bookingId: 7,
      bookingStartUtc: '2026-06-01T01:00:00Z',
      customerName: '홍길동',
      customerUsername: 'gildong123',
      status: 'PENDING',
      topic: '비자 문의',
      totalPrice: 100000,
    },
  ]);

  const { user } = await render(
    <MemoryRouter initialEntries={['/profile?tab=My%20sale&saleTab=Listings']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/bookings/:bookingId" element={<BookingDetailRouteProbe />} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText('비자 문의')).toBeInTheDocument();
  expect(screen.getByText('홍길동')).toBeInTheDocument();
  expect(screen.getByText('@gildong123')).toBeInTheDocument();
  expect(screen.getByText('Booking #7')).toBeInTheDocument();
  expect(screen.getByText('PENDING')).toBeInTheDocument();
  expect(screen.getByText('100,000 won')).toBeInTheDocument();
  expect(screen.getByText('2000-07-24')).toBeInTheDocument();
  expect(bookingService.getCounselorBookings).toHaveBeenCalledTimes(1);

  await act(async () => {
    await user.click(screen.getByRole('button', { name: /비자 문의/ }));
  });

  expect(chatService.getRoomByBooking).not.toHaveBeenCalled();
  expect(screen.getByText('Booking detail route')).toBeInTheDocument();
  expect(screen.getByText('viewer:counselor')).toBeInTheDocument();
  expect(screen.getByText('stateBooking:7')).toBeInTheDocument();
});

it('renders my sale without crashing when optional counselor fields are missing', async () => {
  vi.mocked(counselorService.getMyProfile).mockResolvedValue({
    detail: 'Profile detail.',
    id: '1',
    name: 'Hong',
    regularPrice: 30000,
    reviewCount: 0,
    sessionMinutes: 30,
    timezone: 'Asia/Seoul',
    title: 'Minimal counselor profile',
  } as any);

  await render(
    <MemoryRouter initialEntries={['/profile?tab=My%20sale']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText('Minimal counselor profile')).toBeInTheDocument();
  expect(screen.getByText('No category')).toBeInTheDocument();
});

it('opens the booking detail from customer orders', async () => {
  vi.mocked(bookingService.getMyBookings).mockResolvedValue([
    {
      bookingEndUtc: '2026-06-01T01:30:00Z',
      bookingId: 42,
      bookingStartUtc: '2026-06-01T01:00:00Z',
      counselorCoverImageUrl: 'https://example.com/counselor-cover.jpg',
      counselorId: 9,
      counselorName: 'Hong',
      status: 'PENDING',
      topic: 'Visa question',
      totalPrice: 30000,
    },
  ]);

  const { user } = await render(
    <MemoryRouter initialEntries={['/profile?tab=Orders']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/bookings/:bookingId" element={<BookingDetailRouteProbe />} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText('Visa question')).toBeInTheDocument();
  expect(screen.getByText('@Hong')).toBeInTheDocument();
  expect(screen.getByText('Booking #42')).toBeInTheDocument();
  expect(screen.getByText('PENDING')).toBeInTheDocument();
  expect(screen.getByText('30,000 won')).toBeInTheDocument();
  expect(screen.getByAltText('Hong')).toHaveAttribute('src', 'https://example.com/counselor-cover.jpg');
  expect(bookingService.getMyBookings).toHaveBeenCalledTimes(1);

  await act(async () => {
    await user.click(screen.getByRole('button', { name: /Visa question/ }));
  });

  expect(chatService.getRoomByBooking).not.toHaveBeenCalled();
  expect(screen.getByText('Booking detail route')).toBeInTheDocument();
  expect(screen.getByText('viewer:customer')).toBeInTheDocument();
  expect(screen.getByText('stateBooking:42')).toBeInTheDocument();
});

function BookingDetailRouteProbe() {
  const location = useLocation();
  const state = location.state as { booking?: { bookingId: number }; viewer?: string } | null;

  return (
    <div>
      <p>Booking detail route</p>
      <p>viewer:{state?.viewer}</p>
      <p>stateBooking:{state?.booking?.bookingId}</p>
    </div>
  );
}
