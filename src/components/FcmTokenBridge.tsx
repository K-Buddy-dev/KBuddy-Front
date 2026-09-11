import { useEffect } from 'react';
import { notificationService } from '@/services/notificationService';
import { isLoggedIn } from '@/utils/auth';

const FCM_TOKEN_STORAGE_KEY = 'fcmToken';

export const FCM_AUTH_READY_EVENT = 'kbuddy:fcm-auth-ready';

let lastRegisteredToken: string | null = null;
let pendingRegistrationToken: string | null = null;

export const notifyFcmAuthReady = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(FCM_AUTH_READY_EVENT));
};

export const deleteStoredFcmToken = async () => {
  const token = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);

  if (!token) return;

  try {
    await notificationService.deleteFcmToken(token);
  } catch (error) {
    console.error('FCM token deletion failed:', error);
  } finally {
    lastRegisteredToken = null;
    pendingRegistrationToken = null;
    localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
  }
};

/**
 * 앱(WebView)에 FCM 토큰을 요청한다.
 *
 * 로그인 상태에서만 요청한다. 게스트는 등록할 대상이 없을 뿐 아니라, 앱이 이 시점에
 * 알림 권한을 묻기 때문에 둘러보는 중에 권한 팝업이 뜨게 된다. 로그인이 끝나면
 * FCM_AUTH_READY_EVENT 로 다시 요청된다.
 */
const requestFcmToken = () => {
  if (!window.ReactNativeWebView) return;
  if (!isLoggedIn()) return;
  window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'requestFcmToken' }));
};

const parseMessageData = (data: unknown) => {
  if (typeof data !== 'string') return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const normalizeFcmToken = (token: unknown) => {
  if (typeof token !== 'string') return '';
  return token.trim();
};

const registerFcmToken = async (token: unknown) => {
  const normalizedToken = normalizeFcmToken(token);

  if (!normalizedToken) return;

  if (normalizedToken === lastRegisteredToken || normalizedToken === pendingRegistrationToken) return;

  localStorage.setItem(FCM_TOKEN_STORAGE_KEY, normalizedToken);
  pendingRegistrationToken = normalizedToken;

  try {
    await notificationService.registerFcmToken(normalizedToken);
    lastRegisteredToken = normalizedToken;
  } catch (error) {
    console.error('FCM token registration failed:', error);
  } finally {
    if (pendingRegistrationToken === normalizedToken) {
      pendingRegistrationToken = null;
    }
  }
};

export const FcmTokenBridge = () => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = parseMessageData(event.data);

      if (message?.type === 'fcmTokenReady' && message.token) {
        void registerFcmToken(message.token);
      }
    };

    const handleAuthReady = () => {
      const storedToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);

      if (storedToken) {
        void registerFcmToken(storedToken);
      }

      requestFcmToken();
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as EventListener);
    window.addEventListener(FCM_AUTH_READY_EVENT, handleAuthReady);

    requestFcmToken();

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as EventListener);
      window.removeEventListener(FCM_AUTH_READY_EVENT, handleAuthReady);
    };
  }, []);

  return null;
};
