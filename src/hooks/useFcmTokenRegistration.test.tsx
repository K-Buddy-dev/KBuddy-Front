import { renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { authClient } from '@/api/axiosConfig';
import { useFcmTokenRegistration } from './useFcmTokenRegistration';

const sendFcmTokenToServer = vi.fn();

vi.mock('@/hooks/useFcmToken', () => ({
  useSendFcmTokenToServer: () => ({ mutate: sendFcmTokenToServer }),
}));

const postMessage = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  (window as unknown as { ReactNativeWebView?: unknown }).ReactNativeWebView = { postMessage };
});

afterEach(() => {
  delete authClient.defaults.headers.common.Authorization;
  delete (window as unknown as { ReactNativeWebView?: unknown }).ReactNativeWebView;
});

const renderAt = (path: string) =>
  renderHook(() => useFcmTokenRegistration(), {
    wrapper: ({ children }) => <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>,
  });

it('게스트에게는 토큰을 요청하지 않는다', () => {
  renderAt('/home');

  expect(postMessage).not.toHaveBeenCalled();
});

/**
 * 로그인 후에는 원래 보던 화면으로 돌아간다.
 * 홈에서만 등록하면 홈을 거치지 않은 사용자는 푸시 알림을 받지 못한다.
 */
it('홈이 아닌 화면에서도 로그인 사용자의 토큰을 요청한다', () => {
  authClient.defaults.headers.common['Authorization'] = 'Bearer token';

  renderAt('/community/detail/3');

  expect(postMessage).toHaveBeenCalledWith(JSON.stringify({ action: 'requestFcmToken' }));
});

it('토큰을 받으면 서버에 등록하고 보관한다', async () => {
  authClient.defaults.headers.common['Authorization'] = 'Bearer token';
  renderAt('/profile');

  window.dispatchEvent(
    new MessageEvent('message', { data: JSON.stringify({ type: 'fcmTokenReady', token: 'device-token' }) })
  );

  await waitFor(() => expect(sendFcmTokenToServer).toHaveBeenCalledWith({ token: 'device-token' }));
  expect(localStorage.getItem('fcmToken')).toBe('device-token');
});

it('한 번 요청한 뒤에는 다시 요청하지 않는다', () => {
  authClient.defaults.headers.common['Authorization'] = 'Bearer token';
  const { rerender } = renderAt('/home');

  rerender();

  expect(postMessage).toHaveBeenCalledTimes(1);
});
