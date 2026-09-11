import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import render from '@/utils/test/render';
import { authClient } from '@/api/axiosConfig';
import { authService } from '@/services';
import { AuthGuard } from './AuthGuard';
import { FCM_AUTH_READY_EVENT } from '@/components/FcmTokenBridge';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<AuthGuard />}>
          <Route path="/home" element={<div>Home</div>} />
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/community/detail/:id" element={<div>Post detail</div>} />
          <Route path="/service/:id" element={<div>Service detail</div>} />
          <Route path="/profile" element={<div>My page</div>} />
          <Route path="/community/post" element={<div>Write post</div>} />
          <Route path="/service/:id/request" element={<div>Request</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

const setLoggedIn = () => {
  authClient.defaults.headers.common['Authorization'] = 'Bearer token';
};

afterEach(() => {
  delete authClient.defaults.headers.common.Authorization;
  vi.restoreAllMocks();
});

describe('비로그인 사용자', () => {
  beforeEach(() => {
    // 게스트는 토큰 재발급이 실패하는 것이 정상 경로다.
    vi.spyOn(authService, 'refreshAccessToken').mockRejectedValue(new Error('401'));
  });

  it('홈을 로그인 없이 볼 수 있다', async () => {
    await renderAt('/home');
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('게시글 상세를 로그인 없이 볼 수 있다', async () => {
    await renderAt('/community/detail/1');
    expect(await screen.findByText('Post detail')).toBeInTheDocument();
  });

  it('서비스 상세를 로그인 없이 볼 수 있다', async () => {
    await renderAt('/service/1');
    expect(await screen.findByText('Service detail')).toBeInTheDocument();
  });

  it('마이페이지에 접근하면 로그인 화면으로 보낸다', async () => {
    await renderAt('/profile');
    expect(await screen.findByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('My page')).not.toBeInTheDocument();
  });

  it('글쓰기에 접근하면 로그인 화면으로 보낸다', async () => {
    await renderAt('/community/post');
    expect(await screen.findByText('Login')).toBeInTheDocument();
  });

  it('상담 신청에 접근하면 로그인 화면으로 보낸다', async () => {
    await renderAt('/service/1/request');
    expect(await screen.findByText('Login')).toBeInTheDocument();
  });

  it('경로 끝에 슬래시가 붙어도 보호 경로로 인식한다', async () => {
    // 배포 환경(S3/CloudFront)이 /profile → /profile/ 로 리다이렉트한다.
    await renderAt('/profile/');
    expect(await screen.findByText('Login')).toBeInTheDocument();
  });

  it('로그인 화면을 볼 수 있다', async () => {
    await renderAt('/login');
    expect(await screen.findByText('Login')).toBeInTheDocument();
  });
});

describe('로그인 사용자', () => {
  beforeEach(() => {
    setLoggedIn();
    vi.spyOn(authService, 'refreshAccessToken').mockResolvedValue({ data: { accessToken: 'token' } });
  });

  /**
   * 앱을 다시 열면 로그인 이벤트 없이 조용히 재발급된다. 이때도 푸시 토큰이
   * 다시 등록되도록 FCM 준비 이벤트를 보내야 한다. 보내지 않으면 토큰이 회전된
   * 사용자는 다시 로그인할 때까지 푸시를 받지 못한다.
   */
  it('조용한 재발급이 성공하면 FCM 준비 이벤트를 보낸다', async () => {
    delete authClient.defaults.headers.common['Authorization'];
    const onReady = vi.fn();
    window.addEventListener(FCM_AUTH_READY_EVENT, onReady);

    await renderAt('/home');

    await vi.waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    window.removeEventListener(FCM_AUTH_READY_EVENT, onReady);
  });

  it('마이페이지에 접근할 수 있다', async () => {
    await renderAt('/profile');
    expect(await screen.findByText('My page')).toBeInTheDocument();
  });

  it('로그인 화면 경로에 슬래시가 붙어도 홈으로 보낸다', async () => {
    await renderAt('/login/');
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('로그인 화면에 들어가면 홈으로 보낸다', async () => {
    await renderAt('/login');
    expect(await screen.findByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });
});

/**
 * 로그인 직후 보호 경로로 이동하는 흐름.
 *
 * 인증 여부를 이펙트로 동기화하면 이동과 같은 렌더에서 값이 아직 false라
 * 방금 로그인한 사용자를 다시 로그인 화면으로 돌려보낸다.
 */
it('로그인 직후 보호 경로로 이동해도 로그인 화면으로 되돌아가지 않는다', async () => {
  vi.spyOn(authService, 'refreshAccessToken').mockRejectedValue(new Error('401'));

  function LoginStub() {
    const navigate = useNavigate();
    return (
      <button
        type="button"
        onClick={() => {
          authClient.defaults.headers.common['Authorization'] = 'Bearer token';
          navigate('/profile');
        }}
      >
        Sign in
      </button>
    );
  }

  const { user } = await render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route element={<AuthGuard />}>
          <Route path="/login" element={<LoginStub />} />
          <Route path="/home" element={<div>Home</div>} />
          <Route path="/profile" element={<div>My page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  await user.click(await screen.findByRole('button', { name: 'Sign in' }));

  expect(await screen.findByText('My page')).toBeInTheDocument();
});
