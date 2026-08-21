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

/**
 * 등록은 본문, 해제는 쿼리 파라미터다.
 * 서버가 해제를 @RequestParam 으로 받기 때문이며, 본문으로 보내면 실패한다.
 */
it('registers FCM tokens with a request body and deletes them with a query parameter', async () => {
  vi.mocked(authClient.post).mockResolvedValue({ data: undefined });
  vi.mocked(authClient.delete).mockResolvedValue({ data: undefined });

  await notificationService.registerFcmToken('token-1');
  await notificationService.deleteFcmToken('token-1');

  expect(authClient.post).toHaveBeenCalledWith(expect.stringContaining('/api/v1/fcm-tokens'), {
    token: 'token-1',
  });
  expect(authClient.delete).toHaveBeenCalledWith(expect.stringContaining('/api/v1/fcm-tokens'), {
    params: {
      token: 'token-1',
    },
  });
});

/** 로그아웃 흐름에서는 전역 헤더가 없으므로 액세스 토큰을 직접 실어 보낸다. */
it('attaches the access token when one is given', async () => {
  vi.mocked(authClient.delete).mockResolvedValue({ data: undefined });

  await notificationService.deleteFcmToken('token-1', 'access-token');

  expect(authClient.delete).toHaveBeenCalledWith(expect.stringContaining('/api/v1/fcm-tokens'), {
    params: { token: 'token-1' },
    headers: { Authorization: 'Bearer access-token' },
  });
});
