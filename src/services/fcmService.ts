import { authClient } from '@/api/axiosConfig';

export interface FcmTokenRequest {
  token: string;
  title: string;
  body: string;
}

export interface FcmTokenToServerRequest {
  token: string;
  deviceInfo?: string;
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
  // FCM 토큰 서버 전송
  sendFcmTokenToServer: async (data: FcmTokenToServerRequest): Promise<void> => {
    const response = await authClient.post('https://api.k-buddy.kr/api/v1/fcm-tokens', null, {
      params: {
        token: data.token,
        deviceInfo: data.deviceInfo,
      },
    });
    return response.data;
  },
};
