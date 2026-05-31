import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import render from '@/utils/test/render';
import { bookingService } from '@/services/bookingService';
import { analyticsService } from '@/services/analyticsService';
import { ConfirmLiveChatOrderPage } from './ConfirmLiveChatOrderPage';

vi.mock('@/services/bookingService', () => ({
  bookingService: {
    reserve: vi.fn(),
  },
}));

vi.mock('@/services/analyticsService', () => ({
  analyticsService: {
    trackEvent: vi.fn(),
  },
}));

beforeEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
  vi.mocked(bookingService.reserve).mockResolvedValue({
    bookingEndUtc: '2026-05-20T01:00:00Z',
    bookingId: 1,
    bookingStartUtc: '2026-05-20T00:00:00Z',
    holdExpiresAt: '2026-05-19T23:10:00Z',
    slotCount: 1,
    status: 'PENDING',
    totalPrice: 100000,
  });
});

it('displays a live chat request summary from navigation state', async () => {
  await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/service/3f30797b-5bc8-4750-9b25-b25d4f2ca806/request/confirm',
          state: {
            request: {
              firstName: 'Jenny',
              lastName: 'Ling',
              dateOfBirth: '05/02/1998',
              selectedDate: '2026-05-20T00:00:00.000Z',
              slotIds: [1, 2],
              timeSlots: ['10:00 AM', '10:30 AM'],
              topic: 'Help me prepare for a Korean company interview.',
            },
          },
        },
      ]}
    >
      <Routes>
        <Route path="/service/:id/request/confirm" element={<ConfirmLiveChatOrderPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getAllByText('Confirm order').length).toBeGreaterThan(0);
  expect(screen.getByText('Jenny Ling')).toBeInTheDocument();
  expect(screen.getByText('May 20, 2026')).toBeInTheDocument();
  expect(screen.getByText('10:00 AM, 10:30 AM')).toBeInTheDocument();
  expect(screen.getByText('Help me prepare for a Korean company interview.')).toBeInTheDocument();
});

it('keeps the bottom action bar constrained to the mobile app width', async () => {
  await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/service/3f30797b-5bc8-4750-9b25-b25d4f2ca806/request/confirm',
          state: {
            request: {
              firstName: 'Jenny',
              lastName: 'Ling',
              dateOfBirth: '05/02/1998',
              selectedDate: '2026-05-20T00:00:00.000Z',
              slotIds: [1],
              timeSlots: ['10:00 AM'],
              topic: 'Help me prepare for a Korean company interview.',
            },
          },
        },
      ]}
    >
      <Routes>
        <Route path="/service/:id/request/confirm" element={<ConfirmLiveChatOrderPage />} />
      </Routes>
    </MemoryRouter>
  );

  const bottomActionBar = screen
    .getByRole('button', { name: 'Place order' })
    .closest('[data-testid="confirm-action-bar"]');

  expect(bottomActionBar).toHaveClass('left-1/2');
  expect(bottomActionBar).toHaveClass('-translate-x-1/2');
  expect(bottomActionBar).toHaveClass('sm:w-[600px]');
});

it('navigates to the order placed page when place order is clicked', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date('2026-05-19T12:00:00Z'));

  const { user } = await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/service/3f30797b-5bc8-4750-9b25-b25d4f2ca806/request/confirm',
          state: {
            request: {
              firstName: 'Jenny',
              lastName: 'Ling',
              dateOfBirth: '05/02/1998',
              selectedDate: '2026-05-20T00:00:00.000Z',
              slotIds: [1],
              timeSlots: ['10:00 AM'],
              topic: 'Help me prepare for a Korean company interview.',
            },
          },
        },
      ]}
    >
      <Routes>
        <Route path="/service/:id/request/confirm" element={<ConfirmLiveChatOrderPage />} />
        <Route path="/service/:id/request/placed" element={<PlacedRouteState />} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Place order' }));

  expect(bookingService.reserve).toHaveBeenCalledWith({
    birthDate: '1998-05-02',
    counselorId: '3f30797b-5bc8-4750-9b25-b25d4f2ca806',
    slotIds: [1],
    topic: 'Help me prepare for a Korean company interview.',
  });
  expect(analyticsService.trackEvent).toHaveBeenCalledWith('booking_completed', {
    booking_id: 1,
    counselor_id: '3f30797b-5bc8-4750-9b25-b25d4f2ca806',
    currency: 'KRW',
    slot_count: 1,
    value: 100000,
  });
  expect(screen.getByText(/Booking #1 depositDeadlineAt:2026-05-20T12:00:00\.\d{3}Z/)).toBeInTheDocument();
});

it('shows an error message when place order fails', async () => {
  vi.mocked(bookingService.reserve).mockRejectedValueOnce(new Error('reserve failed'));

  const { user } = await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/service/3f30797b-5bc8-4750-9b25-b25d4f2ca806/request/confirm',
          state: {
            request: {
              firstName: 'Jenny',
              lastName: 'Ling',
              dateOfBirth: '05/02/1998',
              selectedDate: '2026-05-20T00:00:00.000Z',
              slotIds: [1],
              timeSlots: ['10:00 AM'],
              topic: 'Help me prepare for a Korean company interview.',
            },
          },
        },
      ]}
    >
      <Routes>
        <Route path="/service/:id/request/confirm" element={<ConfirmLiveChatOrderPage />} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Place order' }));

  expect(screen.getByText('Unable to place order. Please try again.')).toBeInTheDocument();
});

it('does not call reserve when date of birth cannot be converted to yyyy-MM-dd', async () => {
  const { user } = await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/service/3f30797b-5bc8-4750-9b25-b25d4f2ca806/request/confirm',
          state: {
            request: {
              firstName: 'Jenny',
              lastName: 'Ling',
              dateOfBirth: '24/07/2000',
              selectedDate: '2026-05-20T00:00:00.000Z',
              slotIds: [1],
              timeSlots: ['10:00 AM'],
              topic: 'Help me prepare for a Korean company interview.',
            },
          },
        },
      ]}
    >
      <Routes>
        <Route path="/service/:id/request/confirm" element={<ConfirmLiveChatOrderPage />} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Place order' }));

  expect(bookingService.reserve).not.toHaveBeenCalled();
  expect(screen.getByText('Use a valid date in MM/DD/YYYY format.')).toBeInTheDocument();
});

function PlacedRouteState() {
  const location = useLocation();
  const state = location.state as { booking?: { bookingId: number }; depositDeadlineAt?: string } | null;
  const booking = state?.booking;

  return (
    <div>
      Booking #{booking?.bookingId} depositDeadlineAt:{state?.depositDeadlineAt}
    </div>
  );
}
