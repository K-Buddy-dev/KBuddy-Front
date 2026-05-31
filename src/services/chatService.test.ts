import { authClient } from '@/api/axiosConfig';
import { chatService } from './chatService';

vi.mock('@/api/axiosConfig', () => ({
  authClient: {
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

it('creates a chat room with query params', async () => {
  vi.mocked(authClient.post).mockResolvedValue({ data: undefined });

  await chatService.createRoom({
    clientId: 2,
    counselorId: 1,
    name: '상담사명 - 내담자명',
  });

  expect(authClient.post).toHaveBeenCalledWith('/chat/room', null, {
    params: {
      clientId: 2,
      counselorId: 1,
      name: '상담사명 - 내담자명',
    },
  });
});

it('loads a chat room by booking id', async () => {
  vi.mocked(authClient.get).mockResolvedValue({
    data: {
      name: '상담사명 - 내담자명',
      roomId: 'room-1',
    },
  });

  const room = await chatService.getRoomByBooking(7);

  expect(authClient.get).toHaveBeenCalledWith('/chat/bookings/7/room');
  expect(room).toEqual({
    name: '상담사명 - 내담자명',
    roomId: 'room-1',
  });
});

it('joins, leaves, and marks a chat room as read', async () => {
  vi.mocked(authClient.post).mockResolvedValue({ data: undefined });
  vi.mocked(authClient.patch).mockResolvedValue({ data: undefined });

  await chatService.joinRoom('room-1');
  await chatService.leaveRoom('room-1');
  await chatService.markRoomAsRead('room-1');

  expect(authClient.post).toHaveBeenNthCalledWith(1, '/chat/room/room-1/join');
  expect(authClient.post).toHaveBeenNthCalledWith(2, '/chat/room/room-1/leave');
  expect(authClient.patch).toHaveBeenCalledWith('/chat/rooms/room-1/read');
});
