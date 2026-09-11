import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import render from '@/utils/test/render';
import { NotificationPage } from './NotificationPage';
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications } from '@/hooks/useNotifications';

vi.mock('@/hooks/useNotifications', () => ({
  useMarkAllNotificationsAsRead: vi.fn(),
  useMarkNotificationAsRead: vi.fn(),
  useNotifications: vi.fn(),
}));

vi.mock('@/components/shared/navbar/Navbar', () => ({
  Navbar: () => <div>Notifications</div>,
}));

const mutateAsync = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useMarkAllNotificationsAsRead).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
  } as unknown as ReturnType<typeof useMarkAllNotificationsAsRead>);
  vi.mocked(useMarkNotificationAsRead).mockReturnValue({
    mutateAsync,
  } as unknown as ReturnType<typeof useMarkNotificationAsRead>);
  vi.mocked(useNotifications).mockReturnValue({
    data: {
      content: [
        {
          id: 1,
          isRead: false,
          title: 'New Message',
          message: 'John: Hello there!',
          targetId: 'room-1',
          type: 'CHAT_MESSAGE_NOTIFICATION',
          createdAt: '2026-05-31T10:00:00Z',
        },
      ],
      totalElements: 1,
      totalPages: 1,
    },
    isLoading: false,
    isError: false,
    error: null,
  } as ReturnType<typeof useNotifications>);
  mutateAsync.mockResolvedValue(undefined);
});

it('renders notification list items', async () => {
  await render(
    <MemoryRouter>
      <NotificationPage />
    </MemoryRouter>
  );

  expect(screen.getByText('New Message')).toBeInTheDocument();
  expect(screen.getByText('John: Hello there!')).toBeInTheDocument();
  expect(screen.getByText('Unread')).toBeInTheDocument();
  expect(screen.queryByTestId('notification-page-intro')).not.toBeInTheDocument();
  expect(screen.queryByText('Stay updated on messages and bookings.')).not.toBeInTheDocument();
});

it('shows a service-focused empty notification state', async () => {
  vi.mocked(useNotifications).mockReturnValue({
    data: {
      content: [],
      totalElements: 0,
      totalPages: 0,
    },
    isLoading: false,
    isError: false,
    error: null,
  } as unknown as ReturnType<typeof useNotifications>);

  await render(
    <MemoryRouter>
      <NotificationPage />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: 'You are all caught up' })).toBeInTheDocument();
  expect(
    screen.getByText('New messages, booking updates, and counselor replies will appear here.')
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Explore services' })).toHaveAttribute('href', '/service');
});

it('marks a chat notification as read and opens the chat room', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/notifications']}>
      <Routes>
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/message/:roomId" element={<div>Chat room route</div>} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: /New Message/ }));

  await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith(1));
  expect(screen.getByText('Chat room route')).toBeInTheDocument();
});

it('opens the inquiry tab for service inquiry notifications', async () => {
  vi.mocked(useNotifications).mockReturnValue({
    data: {
      content: [
        {
          id: 3,
          isRead: false,
          title: 'New Inquiry',
          message: 'A customer asked about your service.',
          targetId: 'service-1',
          type: 'SERVICE_INQUIRY_NOTIFICATION',
          createdAt: '2026-06-03T10:00:00Z',
        },
      ],
    },
    isLoading: false,
    isError: false,
    error: null,
  } as ReturnType<typeof useNotifications>);

  const { user } = await render(
    <MemoryRouter initialEntries={['/notifications']}>
      <Routes>
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/service/:serviceId" element={<div>Inquiry route</div>} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: /New Inquiry/ }));

  await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith(3));
  expect(screen.getByText('Inquiry route')).toBeInTheDocument();
});

it('opens a free notification target path when targetId is a route', async () => {
  vi.mocked(useNotifications).mockReturnValue({
    data: {
      content: [
        {
          id: 2,
          isRead: true,
          title: 'New Feature Available',
          message: 'Check out our latest update!',
          targetId: '/service',
          type: 'FREE_NOTIFICATION',
          createdAt: '2026-06-03T10:00:00Z',
        },
      ],
    },
    isLoading: false,
    isError: false,
    error: null,
  } as ReturnType<typeof useNotifications>);

  const { user } = await render(
    <MemoryRouter initialEntries={['/notifications']}>
      <Routes>
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/service" element={<div>Service route</div>} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: /New Feature Available/ }));

  expect(screen.getByText('Service route')).toBeInTheDocument();
});
