import { authClient } from '@/api/axiosConfig';
import { NotificationItem, NotificationPageResponse } from '@/types/notification';

interface GetNotificationsParams {
  page?: number;
  size?: number;
}

const getApiV1BaseUrl = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.k-buddy.kr/kbuddy/v1';
  return apiBaseUrl.replace(/\/kbuddy\/v1\/?$/, '/api/v1').replace(/\/$/, '');
};

const notificationApiUrl = (path: string) => `${getApiV1BaseUrl()}${path}`;

const unwrapData = <T>(payload: T | { data: T }): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};

export const notificationService = {
  getNotifications: async ({ page = 0, size = 20 }: GetNotificationsParams = {}): Promise<NotificationPageResponse> => {
    const response = await authClient.get<NotificationPageResponse | { data: NotificationPageResponse }>(
      notificationApiUrl('/notifications'),
      {
        params: {
          page,
          size,
          sort: 'createdAt,desc',
        },
      }
    );
    return unwrapData(response.data);
  },
  getUnreadNotifications: async (): Promise<NotificationItem[]> => {
    const response = await authClient.get<NotificationItem[] | { data: NotificationItem[] }>(
      notificationApiUrl('/notifications/unread')
    );
    return unwrapData(response.data);
  },
  getUnreadCount: async (): Promise<number> => {
    const response = await authClient.get<number | { data: number }>(notificationApiUrl('/notifications/unread/count'));
    return unwrapData(response.data);
  },
  markAsRead: async (notificationId: number): Promise<void> => {
    await authClient.patch(notificationApiUrl(`/notifications/${notificationId}/read`));
  },
  markAllAsRead: async (): Promise<void> => {
    await authClient.post(notificationApiUrl('/notifications/read-all'));
  },
  registerFcmToken: async (token: string, deviceInfo?: string): Promise<void> => {
    const normalizedToken = token?.trim();

    if (!normalizedToken) return;

    await authClient.post(notificationApiUrl('/fcm-tokens'), null, {
      params: {
        ...(deviceInfo ? { deviceInfo } : {}),
        token: normalizedToken,
      },
    });
  },
  deleteFcmToken: async (token: string): Promise<void> => {
    const normalizedToken = token?.trim();

    if (!normalizedToken) return;

    await authClient.delete(notificationApiUrl('/fcm-tokens'), {
      data: { token: normalizedToken },
    });
  },
};
