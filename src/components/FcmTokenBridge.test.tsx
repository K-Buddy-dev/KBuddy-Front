import { act, render, waitFor } from '@testing-library/react';
import { FCM_AUTH_READY_EVENT, FcmTokenBridge } from './FcmTokenBridge';
import { notificationService } from '@/services/notificationService';
import { authClient } from '@/api/axiosConfig';

vi.mock('@/services/notificationService', () => ({
  notificationService: {
    registerFcmToken: vi.fn(),
  },
}));

const signIn = () => {
  authClient.defaults.headers.common['Authorization'] = 'Bearer token';
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  delete window.ReactNativeWebView;
  delete authClient.defaults.headers.common['Authorization'];
});

/**
 * 게스트는 토큰을 요청하지 않는다. 앱은 토큰 요청 시점에 알림 권한을 묻기 때문에,
 * 둘러보는 중인 사용자에게 권한 팝업이 떠서는 안 된다.
 */
it('does not request an FCM token from native while logged out', () => {
  window.ReactNativeWebView = { postMessage: vi.fn() };

  render(<FcmTokenBridge />);

  expect(window.ReactNativeWebView.postMessage).not.toHaveBeenCalled();
  expect(notificationService.registerFcmToken).not.toHaveBeenCalled();
});

it('registers an FCM token even when native responds immediately to the request', async () => {
  signIn();
  window.ReactNativeWebView = {
    postMessage: vi.fn(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            token: 'new-user-token',
            type: 'fcmTokenReady',
          }),
        })
      );
    }),
  };

  render(<FcmTokenBridge />);

  await waitFor(() => {
    expect(notificationService.registerFcmToken).toHaveBeenCalledWith('new-user-token');
  });
  expect(localStorage.getItem('fcmToken')).toBe('new-user-token');
});

it('re-registers a stored FCM token when authentication becomes ready', async () => {
  localStorage.setItem('fcmToken', 'stored-token');
  //로그인 흐름은 전역 헤더를 먼저 설정한 뒤 FCM_AUTH_READY_EVENT 를 보낸다.
  signIn();
  window.ReactNativeWebView = {
    postMessage: vi.fn(),
  };

  render(<FcmTokenBridge />);

  vi.clearAllMocks();

  act(() => {
    window.dispatchEvent(new Event(FCM_AUTH_READY_EVENT));
  });

  await waitFor(() => {
    expect(notificationService.registerFcmToken).toHaveBeenCalledWith('stored-token');
  });
  expect(window.ReactNativeWebView.postMessage).toHaveBeenCalledWith(JSON.stringify({ action: 'requestFcmToken' }));
});

it('ignores empty and duplicate native FCM token messages', async () => {
  window.ReactNativeWebView = {
    postMessage: vi.fn(),
  };

  render(<FcmTokenBridge />);

  act(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({
          token: '   ',
          type: 'fcmTokenReady',
        }),
      })
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({
          token: 'dedupe-token',
          type: 'fcmTokenReady',
        }),
      })
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({
          token: 'dedupe-token',
          type: 'fcmTokenReady',
        }),
      })
    );
  });

  await waitFor(() => {
    expect(notificationService.registerFcmToken).toHaveBeenCalledTimes(1);
  });
  expect(notificationService.registerFcmToken).toHaveBeenCalledWith('dedupe-token');
});
