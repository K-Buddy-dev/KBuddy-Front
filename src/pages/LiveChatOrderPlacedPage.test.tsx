import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import render from '@/utils/test/render';
import { LiveChatOrderPlacedPage } from './LiveChatOrderPlacedPage';

it('displays bank transfer instructions from the reserved booking', async () => {
  await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/service/1/request/placed',
          state: {
            booking: {
              bookingId: 17,
              bookingStartUtc: '2026-05-20T00:00:00Z',
              bookingEndUtc: '2026-05-20T01:00:00Z',
              holdExpiresAt: '2026-05-19T23:10:00Z',
              slotCount: 2,
              status: 'PENDING',
              totalPrice: 30000,
            },
            depositDeadlineAt: '2026-05-20T12:00:00Z',
          },
        },
      ]}
    >
      <Routes>
        <Route path="/service/:id/request/placed" element={<LiveChatOrderPlacedPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Waiting for bank transfer')).toBeInTheDocument();
  expect(screen.getByText('Booking #17')).toBeInTheDocument();
  expect(screen.getByText('30,000 won')).toBeInTheDocument();
  expect(screen.getByText('KB Bank(국민은행) 649301-04-167585')).toBeInTheDocument();
  expect(screen.getByText('최수용')).toBeInTheDocument();
  expect(screen.getByText('May 20, 2026 at 9:00 PM')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Go to service' })).toBeInTheDocument();
});

it('does not crash when booking state is missing', async () => {
  await render(
    <MemoryRouter initialEntries={['/service/1/request/placed']}>
      <Routes>
        <Route path="/service/:id/request/placed" element={<LiveChatOrderPlacedPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Waiting for bank transfer')).toBeInTheDocument();
  expect(screen.getByText('Booking pending')).toBeInTheDocument();
  expect(screen.getAllByText('-').length).toBeGreaterThan(0);
});

it('displays bank transfer instructions when booking state is wrapped in data', async () => {
  await render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/service/1/request/placed',
          state: {
            booking: {
              data: {
                bookingId: 18,
                bookingStartUtc: '2026-05-20T00:00:00Z',
                bookingEndUtc: '2026-05-20T01:00:00Z',
                holdExpiresAt: '2026-05-19T23:10:00Z',
                slotCount: 2,
                status: 'PENDING',
                totalPrice: 120000,
              },
            },
          },
        },
      ]}
    >
      <Routes>
        <Route path="/service/:id/request/placed" element={<LiveChatOrderPlacedPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Booking #18')).toBeInTheDocument();
  expect(screen.getByText('120,000 won')).toBeInTheDocument();
});

it('replaces history when closing to service detail so back does not return to order placed', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/service/1/request/placed']}>
      <Routes>
        <Route path="/service/:id/request/placed" element={<LiveChatOrderPlacedPage />} />
        <Route path="/service/:id" element={<RouteProbe />} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: '' }));

  expect(screen.getByText('/service/1')).toBeInTheDocument();

  await user.keyboard('{Alt>}{ArrowLeft}{/Alt}');

  expect(screen.queryByText('Waiting for bank transfer')).not.toBeInTheDocument();
});

function RouteProbe() {
  const location = useLocation();
  return <div>{location.pathname}</div>;
}
