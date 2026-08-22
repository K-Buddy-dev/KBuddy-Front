import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { isLoggedIn } from '@/utils/auth';
import { useSendFcmTokenToServer } from '@/hooks/useFcmToken';

/**
 * 앱(WebView)에 FCM 토큰을 요청하고 서버에 등록한다.
 *
 * 홈이 아니라 앱 전역에서 동작해야 한다. 로그인 후에는 원래 보던 화면으로 돌아가므로,
 * 홈에서만 등록하면 홈을 거치지 않은 사용자는 푸시 알림을 받지 못한다.
 *
 * 토큰 요청은 로그인 상태에서만 한다. 게스트는 등록할 대상이 없을 뿐 아니라,
 * 앱이 이 시점에 알림 권한을 묻기 때문에 둘러보는 중에 권한 팝업이 뜨게 된다.
 */
export const useFcmTokenRegistration = () => {
  const location = useLocation();
  const { mutate: sendFcmTokenToServer } = useSendFcmTokenToServer();
  const tokenRequested = useRef(false);

  //토큰 수신 리스너는 요청보다 먼저 붙어 있어야 한다.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      //화면 단위가 아니라 앱 전역에서 듣게 되었으므로, 이 핸들러와 무관한 메시지가
      //훨씬 많이 들어온다. 파싱 실패는 다른 핸들러의 메시지이므로 조용히 넘긴다.
      if (typeof event.data !== 'string') {
        return;
      }

      let message: { type?: string; token?: string };
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      if (message.type === 'fcmTokenReady' && message.token) {
        localStorage.setItem('fcmToken', message.token);
        sendFcmTokenToServer({ token: message.token });
      }
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as unknown as EventListener);
    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as unknown as EventListener);
    };
  }, [sendFcmTokenToServer]);

  //로그인 직후 어느 화면으로 돌아가든 등록되도록 경로 변경마다 확인한다.
  useEffect(() => {
    if (tokenRequested.current || !isLoggedIn()) {
      return;
    }

    if (typeof window !== 'undefined' && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'requestFcmToken' }));
      tokenRequested.current = true;
    }
  }, [location.pathname]);
};
