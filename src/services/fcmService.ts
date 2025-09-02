import { authClient } from '@/api/axiosConfig';

interface FcmTokenRequest {
  token: string;
  title: string;
  body: string;
}
export const fcmService = {
  // FCM 알림 전송
  sendFcmToken: async (data: FcmTokenRequest): Promise<void> => {
    const response = await authClient.post('https://api.k-buddy.kr/api/v1/notifications/send', null, {
      params: {
        token: data.token,
        title: data.title,
        body: data.body,
      },
    });
    return response.data;
  },
};
