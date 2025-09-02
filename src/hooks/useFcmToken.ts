import { useMutation } from '@tanstack/react-query';
import { fcmService } from '@/services/fcmService';

interface FcmTokenRequest {
  token: string;
  title: string;
  body: string;
}

export const useSendFcmToken = () => {
  return useMutation<void, Error, FcmTokenRequest>({
    mutationFn: (data: FcmTokenRequest) => fcmService.sendFcmToken(data),
    onSuccess: () => {
      console.log('FCM 토큰 전송 성공');
    },
    onError: (error) => {
      console.error('FCM 토큰 전송 실패:', error);
    },
  });
};
