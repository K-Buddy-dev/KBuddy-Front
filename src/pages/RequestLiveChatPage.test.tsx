import { act, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import render from '@/utils/test/render';
import { counselorService } from '@/services/counselorService';
import { authService } from '@/services/authService';
import { analyticsService } from '@/services/analyticsService';
import { ConfirmLiveChatOrderPage } from './ConfirmLiveChatOrderPage';
import { RequestLiveChatPage } from './RequestLiveChatPage';

vi.mock('@/services/counselorService', () => ({
  counselorService: {
    getCounselorAvailability: vi.fn(),
  },
}));

vi.mock('@/services/authService', () => ({
  authService: {
    getUserProfile: vi.fn(),
  },
}));

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
  localStorage.clear();
  sessionStorage.clear();
  const todayAtTen = new Date();
  todayAtTen.setHours(10, 0, 0, 0);

  vi.mocked(authService.getUserProfile).mockResolvedValue({
    data: {
      birthDate: '1998-05-02',
      firstName: 'Mina',
      lastName: 'Kim',
      userId: 'mina',
      uuid: 'user-uuid',
    },
  });
  vi.mocked(counselorService.getCounselorAvailability).mockResolvedValue({
    slots: [
      {
        availabilityId: 101,
        slotStartUtc: todayAtTen.toISOString(),
        status: 'AVAILABLE',
      },
    ],
  });
});

afterEach(() => {
  vi.useRealTimers();
});

function useStableCalendarDate() {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date('2026-05-20T09:00:00+09:00'));
}

it('loads requester name and birth date from local storage without fetching the user profile', async () => {
  localStorage.setItem(
    'basicUserData',
    JSON.stringify({
      birthDate: '1998-05-02',
      firstName: 'Cached',
      lastName: 'User',
    })
  );

  await render(
    <MemoryRouter initialEntries={['/service/7/request']}>
      <Routes>
        <Route path="/service/:id/request" element={<RequestLiveChatPage />} />
      </Routes>
    </MemoryRouter>
  );
  await act(async () => {});

  expect(await screen.findByDisplayValue('Cached')).toBeInTheDocument();
  expect(screen.getByDisplayValue('User')).toBeInTheDocument();
  expect(screen.getByDisplayValue('05/02/1998')).toBeInTheDocument();
  expect(authService.getUserProfile).not.toHaveBeenCalled();
});

it('formats date of birth with numeric input only', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/service/7/request']}>
      <Routes>
        <Route path="/service/:id/request" element={<RequestLiveChatPage />} />
      </Routes>
    </MemoryRouter>
  );
  await act(async () => {});

  const dateInput = await screen.findByPlaceholderText('MM/DD/YYYY');
  await user.clear(dateInput);
  await user.type(dateInput, '05abc021998');

  expect(dateInput).toHaveValue('05/02/1998');
});

it('prevents continuing when date of birth is not a valid MM/DD/YYYY date', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/service/7/request']}>
      <Routes>
        <Route path="/service/:id/request" element={<RequestLiveChatPage />} />
        <Route path="/service/:id/request/confirm" element={<div>Confirm route</div>} />
      </Routes>
    </MemoryRouter>
  );
  await act(async () => {});

  const dateInput = await screen.findByPlaceholderText('MM/DD/YYYY');
  await user.clear(dateInput);
  await user.type(dateInput, '24072000');
  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.type(screen.getByPlaceholderText('Tap here to start writing'), '강남 맛집 추천해주세요');
  await user.click(screen.getByRole('button', { name: 'Next' }));

  expect(await screen.findByText('Use a valid date in MM/DD/YYYY format')).toBeInTheDocument();
  expect(screen.queryByText('Confirm route')).not.toBeInTheDocument();
});

it('loads requester name and birth date from the user profile', async () => {
  await render(
    <MemoryRouter initialEntries={['/service/7/request']}>
      <Routes>
        <Route path="/service/:id/request" element={<RequestLiveChatPage />} />
      </Routes>
    </MemoryRouter>
  );
  await act(async () => {});

  expect(await screen.findByDisplayValue('Mina')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Kim')).toBeInTheDocument();
  expect(screen.getByDisplayValue('05/02/1998')).toBeInTheDocument();
  expect(screen.queryByDisplayValue('Jenny')).not.toBeInTheDocument();
});

it('highlights dates that have available time slots', async () => {
  useStableCalendarDate();
  const tomorrowAtTen = new Date();
  tomorrowAtTen.setDate(tomorrowAtTen.getDate() + 1);
  tomorrowAtTen.setHours(10, 0, 0, 0);

  vi.mocked(counselorService.getCounselorAvailability).mockResolvedValueOnce({
    slots: [
      {
        availabilityId: 202,
        slotStartUtc: tomorrowAtTen.toISOString(),
        status: 'AVAILABLE',
      },
    ],
  });

  await render(
    <MemoryRouter initialEntries={['/service/7/request']}>
      <Routes>
        <Route path="/service/:id/request" element={<RequestLiveChatPage />} />
      </Routes>
    </MemoryRouter>
  );

  const availableDateButton = await screen.findByRole('button', {
    name: String(tomorrowAtTen.getDate()),
  });

  await waitFor(() => {
    expect(availableDateButton.parentElement).toHaveClass('bg-bg-highlight-hover');
  });
});

it('keeps the bottom action bar constrained to the mobile app width', async () => {
  await render(
    <MemoryRouter initialEntries={['/service/7/request']}>
      <Routes>
        <Route path="/service/:id/request" element={<RequestLiveChatPage />} />
      </Routes>
    </MemoryRouter>
  );

  const bottomActionBar = screen.getByRole('button', { name: 'Next' }).closest('[data-testid="request-action-bar"]');

  expect(bottomActionBar).toHaveClass('left-1/2');
  expect(bottomActionBar).toHaveClass('-translate-x-1/2');
  expect(bottomActionBar).toHaveClass('sm:w-[600px]');
});

it('restores the entered request when returning from confirm order', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/service/7/request']}>
      <Routes>
        <Route path="/service/:id/request" element={<RequestLiveChatPage />} />
        <Route path="/service/:id/request/confirm" element={<ConfirmLiveChatOrderPage />} />
      </Routes>
    </MemoryRouter>
  );
  await act(async () => {});

  const firstNameInput = await screen.findByDisplayValue('Mina');
  await user.clear(firstNameInput);
  await user.type(firstNameInput, 'Jenny');
  await user.clear(screen.getByDisplayValue('Kim'));
  await user.type(screen.getByLabelText('Last name'), 'Ling');
  await user.clear(screen.getByPlaceholderText('MM/DD/YYYY'));
  await user.type(screen.getByPlaceholderText('MM/DD/YYYY'), '06071999');
  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.type(screen.getByPlaceholderText('Tap here to start writing'), 'I need help with a visa interview.');
  await user.click(screen.getByRole('button', { name: 'Next' }));

  expect(await screen.findByText('Jenny Ling')).toBeInTheDocument();
  expect(analyticsService.trackEvent).toHaveBeenCalledWith('booking_request_submitted', {
    counselor_id: '7',
    selected_slot_count: 1,
    topic_length: 34,
  });

  await user.click(screen.getByRole('button', { name: 'Back' }));

  expect(await screen.findByDisplayValue('Jenny')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Ling')).toBeInTheDocument();
  expect(screen.getByDisplayValue('06/07/1999')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '10:00 AM' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByDisplayValue('I need help with a visa interview.')).toBeInTheDocument();
});

it('passes selected availability ids to the confirm order page', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/service/7/request']}>
      <Routes>
        <Route path="/service/:id/request" element={<RequestLiveChatPage />} />
        <Route path="/service/:id/request/confirm" element={<ConfirmStateProbe />} />
      </Routes>
    </MemoryRouter>
  );
  await act(async () => {});

  expect(await screen.findByRole('button', { name: '10:00 AM' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '10:00 AM' }));
  await user.type(screen.getByPlaceholderText('Tap here to start writing'), '강남 맛집 추천해주세요');
  await user.click(screen.getByRole('button', { name: 'Next' }));

  await waitFor(() => {
    expect(screen.getByText('slotIds:101')).toBeInTheDocument();
  });
});

function ConfirmStateProbe() {
  const location = useLocation();
  const state = location.state as { request?: { slotIds?: number[] } } | undefined;
  return <div>slotIds:{state?.request?.slotIds?.join(',')}</div>;
}
