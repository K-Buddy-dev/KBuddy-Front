import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import render from '@/utils/test/render';
import { useChatRooms } from '@/hooks/useChatRooms';
import { MessagePage } from './MessagePage';

vi.mock('@/hooks/useChatRooms', () => ({
  useChatRooms: vi.fn(),
}));

vi.mock('@/components/shared/navbar/Navbar', () => ({
  Navbar: () => <div>Messages</div>,
}));

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-05-30T15:35:00'));
  vi.mocked(useChatRooms).mockReturnValue({
    data: [
      {
        roomId: 'room-today',
        roomName: 'Today room',
        peerUserId: 1,
        peerNickname: 'today-user',
        peerProfileImageUrl: null,
        lastMessage: 'Today message',
        lastMessageAt: '2026-05-30T15:31:00',
        unreadCount: 0,
      },
      {
        roomId: 'room-yesterday',
        roomName: 'Yesterday room',
        peerUserId: 2,
        peerNickname: 'yesterday-user',
        peerProfileImageUrl: null,
        lastMessage: 'Yesterday message',
        lastMessageAt: '2026-05-29T11:00:00',
        unreadCount: 0,
      },
      {
        roomId: 'room-old',
        roomName: 'Old room',
        peerUserId: 3,
        peerNickname: 'old-user',
        peerProfileImageUrl: null,
        lastMessage: 'Old message',
        lastMessageAt: '2026-05-15T09:20:00',
        unreadCount: 0,
      },
    ],
    isLoading: false,
    isError: false,
    error: null,
  } as ReturnType<typeof useChatRooms>);
});

afterEach(() => {
  vi.useRealTimers();
});

it('shows chat room list times without long ago units', async () => {
  await render(
    <MemoryRouter>
      <MessagePage />
    </MemoryRouter>
  );

  expect(screen.getByText('pm 3:31')).toBeInTheDocument();
  expect(screen.getByText('Yesterday')).toBeInTheDocument();
  expect(screen.getByText('May 15')).toBeInTheDocument();
  expect(screen.queryByText(/d ago/)).not.toBeInTheDocument();
});

it('uses the default profile image when the peer image is missing', async () => {
  await render(
    <MemoryRouter>
      <MessagePage />
    </MemoryRouter>
  );

  expect(screen.getByAltText('today-user')).toHaveAttribute('src', expect.stringContaining('default-profile'));
});
