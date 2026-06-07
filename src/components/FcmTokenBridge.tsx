import { useEffect } from 'react';
import { notificationService } from '@/services/notificationService';

const FCM_TOKEN_STORAGE_KEY = 'fcmToken';

export const FCM_AUTH_READY_EVENT = 'kbuddy:fcm-auth-ready';

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
    localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
  }
};

const requestFcmToken = () => {
  if (!window.ReactNativeWebView) return;
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

const registerFcmToken = async (token: string) => {
  localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);

  try {
    await notificationService.registerFcmToken(token);
  } catch (error) {
    console.error('FCM token registration failed:', error);
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
