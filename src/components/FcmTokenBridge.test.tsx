import { act, render, waitFor } from '@testing-library/react';
import { FCM_AUTH_READY_EVENT, FcmTokenBridge } from './FcmTokenBridge';
import { notificationService } from '@/services/notificationService';

vi.mock('@/services/notificationService', () => ({
  notificationService: {
    registerFcmToken: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  delete window.ReactNativeWebView;
});

it('registers an FCM token even when native responds immediately to the request', async () => {
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
