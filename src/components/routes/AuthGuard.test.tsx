import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import render from '@/utils/test/render';
import { authClient } from '@/api/axiosConfig';
import { authService } from '@/services';
import { AuthGuard } from './AuthGuard';

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
