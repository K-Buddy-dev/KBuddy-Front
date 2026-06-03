import { authClient } from '@/api/axiosConfig';
import { notificationService } from './notificationService';

vi.mock('@/api/axiosConfig', () => ({
  authClient: {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

it('loads paged notifications from the notification API', async () => {
  vi.mocked(authClient.get).mockResolvedValue({
    data: {
      content: [
        {
          createdAt: '2026-06-02T22:47:24',
          id: 33,
          isRead: false,
          message: '상담 예약이 확정되었습니다.',
          targetId: 'abc-123',
          title: '예약 확정',
          type: 'BOOKING_CONFIRMED',
        },
      ],
    },
  });

  const result = await notificationService.getNotifications({ page: 0, size: 20 });

  expect(authClient.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/notifications'), {
    params: {
      page: 0,
      size: 20,
      sort: 'createdAt,desc',
    },
  });
  expect(result.content).toHaveLength(1);
  expect(result.content[0]).toEqual({
    createdAt: '2026-06-02T22:47:24',
    id: 33,
    isRead: false,
    message: '상담 예약이 확정되었습니다.',
    targetId: 'abc-123',
    title: '예약 확정',
    type: 'BOOKING_CONFIRMED',
  });
});

it('marks a notification as read and reads all notifications', async () => {
  vi.mocked(authClient.patch).mockResolvedValue({ data: undefined });
  vi.mocked(authClient.post).mockResolvedValue({ data: undefined });

  await notificationService.markAsRead(7);
  await notificationService.markAllAsRead();

  expect(authClient.patch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/notifications/7/read'));
  expect(authClient.post).toHaveBeenCalledWith(expect.stringContaining('/api/v1/notifications/read-all'));
});

it('registers and deletes FCM tokens with request bodies', async () => {
  vi.mocked(authClient.post).mockResolvedValue({ data: undefined });
  vi.mocked(authClient.delete).mockResolvedValue({ data: undefined });

  await notificationService.registerFcmToken('token-1');
  await notificationService.deleteFcmToken('token-1');

  expect(authClient.post).toHaveBeenCalledWith(expect.stringContaining('/api/v1/fcm-tokens'), {
    token: 'token-1',
  });
  expect(authClient.delete).toHaveBeenCalledWith(expect.stringContaining('/api/v1/fcm-tokens'), {
    data: {
      token: 'token-1',
    },
  });
});
