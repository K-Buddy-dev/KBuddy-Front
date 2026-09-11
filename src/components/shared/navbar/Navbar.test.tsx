import { screen } from '@testing-library/react';
import { LoginPromptProvider } from '@/hooks/useLoginPrompt';
import { waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import render from '@/utils/test/render';
import { Navbar } from './Navbar';
import { notificationService } from '@/services/notificationService';
import { authClient } from '@/api/axiosConfig';

vi.mock('@/services/notificationService', () => ({
  notificationService: {
    getUnreadCount: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(notificationService.getUnreadCount).mockResolvedValue(0);
});

afterEach(() => {
  delete authClient.defaults.headers.common.Authorization;
});

const signIn = () => {
  authClient.defaults.headers.common['Authorization'] = 'Bearer token';
};

it('navigates home when the logo is clicked in the search navbar', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/service']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/service" element={<Navbar withSearch />} />
          <Route path="/home" element={<div>Home route</div>} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Go to home' }));

  expect(screen.getByText('Home route')).toBeInTheDocument();
});

it('navigates home when the logo is clicked in the basic navbar', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/profile']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/profile" element={<Navbar withSearch={false} />} />
          <Route path="/home" element={<div>Home route</div>} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Go to home' }));

  expect(screen.getByText('Home route')).toBeInTheDocument();
});

it('shows the settings action only when a settings handler is provided', async () => {
  const onClickSettings = vi.fn();
  const { user } = await render(
    <MemoryRouter>
      <LoginPromptProvider>
        <Navbar withSearch={false} onClickSettings={onClickSettings} />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Open settings' }));

  expect(onClickSettings).toHaveBeenCalledTimes(1);
});

it('shows the notification action in the search navbar', async () => {
  await render(
    <MemoryRouter>
      <LoginPromptProvider>
        <Navbar withSearch />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(screen.getByRole('button', { name: 'Open notifications' })).toBeInTheDocument();
});

it('shows the notification action in the basic navbar', async () => {
  await render(
    <MemoryRouter>
      <LoginPromptProvider>
        <Navbar withSearch={false} />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(screen.getByRole('button', { name: 'Open notifications' })).toBeInTheDocument();
});

it('navigates to notifications when the notification action is clicked', async () => {
  signIn();
  const { user } = await render(
    <MemoryRouter initialEntries={['/service']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/service" element={<Navbar withSearch />} />
          <Route path="/notifications" element={<div>Notifications route</div>} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Open notifications' }));

  expect(screen.getByText('Notifications route')).toBeInTheDocument();
});

it('shows the unread notification count', async () => {
  signIn();
  vi.mocked(notificationService.getUnreadCount).mockResolvedValue(3);

  await render(
    <MemoryRouter>
      <LoginPromptProvider>
        <Navbar withSearch={false} />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument());
});

it('hides the settings action when no settings handler is provided', async () => {
  await render(
    <MemoryRouter>
      <LoginPromptProvider>
        <Navbar withSearch={false} />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(screen.queryByRole('button', { name: 'Open settings' })).not.toBeInTheDocument();
});

/**
 * 홈/커뮤니티/서비스가 공개되면서 Navbar도 게스트에게 렌더된다.
 * 알림 조회를 남겨두면 게스트가 페이지마다 401과 토큰 재발급 시도를 발생시킨다.
 */
it('does not fetch the unread count for guests', async () => {
  await render(
    <MemoryRouter>
      <LoginPromptProvider>
        <Navbar withSearch={false} />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(notificationService.getUnreadCount).not.toHaveBeenCalled();
});

it('fetches the unread count for signed-in users', async () => {
  signIn();

  await render(
    <MemoryRouter>
      <LoginPromptProvider>
        <Navbar withSearch={false} />
      </LoginPromptProvider>
    </MemoryRouter>
  );

  await waitFor(() => expect(notificationService.getUnreadCount).toHaveBeenCalled());
});

/** 알림함은 로그인이 필요하므로, 게스트에게는 화면 전환 대신 안내를 띄운다. */
it('shows a login prompt instead of navigating for guests', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/home" element={<Navbar withSearch={false} />} />
          <Route path="/notifications" element={<div>Notifications page</div>} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Open notifications' }));

  expect(screen.getByText('Log in to see your notifications.')).toBeInTheDocument();
  expect(screen.queryByText('Notifications page')).not.toBeInTheDocument();
});
