import { act, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import render from '@/utils/test/render';
import { chatService } from '@/services/chatService';
import { BookingDetailPage } from './BookingDetailPage';

vi.mock('@/services/chatService', () => ({
  chatService: {
    getRoomByBooking: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(chatService.getRoomByBooking).mockResolvedValue({
    name: 'Chat room',
    roomId: 'room-1',
  });
});

it('shows counselor-side booking details before opening chat', async () => {
  const { user } = await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/profile/bookings/7',
          state: {
            viewer: 'counselor',
            booking: {
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
          },
        },
      ]}
    >
      <Routes>
        <Route path="/profile/bookings/:bookingId" element={<BookingDetailPage />} />
        <Route path="/message/:roomId" element={<div>Chat room route</div>} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: 'Order detail' })).toBeInTheDocument();
  expect(screen.getByText('Booking #7')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: '비자 문의' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Request details' })).toBeInTheDocument();
  expect(screen.getByTestId('booking-request-details')).toHaveTextContent('비자 문의');
  expect(screen.getByText('홍길동')).toBeInTheDocument();
  expect(screen.getByText('@gildong123')).toBeInTheDocument();
  expect(screen.getByText('PENDING')).toBeInTheDocument();
  expect(screen.getByText('100,000 won')).toBeInTheDocument();
  expect(screen.getByText('2000-07-24')).toBeInTheDocument();
  expect(chatService.getRoomByBooking).not.toHaveBeenCalled();

  await act(async () => {
    await user.click(screen.getByRole('button', { name: 'Open chat' }));
  });

  expect(chatService.getRoomByBooking).toHaveBeenCalledWith(7);
  expect(screen.getByText('Chat room route')).toBeInTheDocument();
});

it('shows customer-side booking details', async () => {
  await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/profile/bookings/42',
          state: {
            viewer: 'customer',
            booking: {
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
          },
        },
      ]}
    >
      <Routes>
        <Route path="/profile/bookings/:bookingId" element={<BookingDetailPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Booking #42')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Visa question' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Request details' })).toBeInTheDocument();
  expect(screen.getByTestId('booking-request-details')).toHaveTextContent('Visa question');
  expect(screen.getByText('@Hong')).toBeInTheDocument();
  expect(screen.getByText('30,000 won')).toBeInTheDocument();
  expect(screen.getByAltText('Hong')).toHaveAttribute('src', 'https://example.com/counselor-cover.jpg');
});

it('explains when a booking detail is opened without state', async () => {
  await render(
    <MemoryRouter initialEntries={['/profile/bookings/99']}>
      <Routes>
        <Route path="/profile/bookings/:bookingId" element={<BookingDetailPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Order information is unavailable.')).toBeInTheDocument();
});
