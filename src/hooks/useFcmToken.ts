import { useMutation } from '@tanstack/react-query';
import { fcmService, FcmTokenRequest, FcmTokenToServerRequest } from '@/services/fcmService';

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

export const useSendFcmTokenToServer = () => {
  return useMutation<void, Error, FcmTokenToServerRequest>({
    mutationFn: (data: FcmTokenToServerRequest) => fcmService.sendFcmTokenToServer(data),
    onSuccess: () => {
      console.log('FCM 토큰 서버 등록 성공');
    },
    onError: (error) => {
      console.error('FCM 토큰 서버 등록 실패:', error);
    },
  });
};
