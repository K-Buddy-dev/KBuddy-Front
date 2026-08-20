import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, expect, it } from 'vitest';
import render from '@/utils/test/render';
import { authClient } from '@/api/axiosConfig';
import { LoginPromptProvider } from '@/hooks/useLoginPrompt';
import { BottomNavigation } from './BottomNavigation';

const renderNav = () =>
  render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/home" element={<BottomNavigation />} />
          <Route path="/community" element={<div>Community page</div>} />
          <Route path="/profile" element={<div>My page content</div>} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

afterEach(() => {
  delete authClient.defaults.headers.common.Authorization;
});

it('게스트가 마이페이지 탭을 누르면 이동 대신 로그인 안내를 띄운다', async () => {
  const { user } = await renderNav();

  await user.click(screen.getByText('My page'));

  expect(screen.getByText('Log in to use My page.')).toBeInTheDocument();
  expect(screen.queryByText('My page content')).not.toBeInTheDocument();
});

it('로그인 사용자는 마이페이지로 이동한다', async () => {
  authClient.defaults.headers.common['Authorization'] = 'Bearer token';
  const { user } = await renderNav();

  await user.click(screen.getByText('My page'));

  expect(await screen.findByText('My page content')).toBeInTheDocument();
});

it('로그인이 필요 없는 탭은 게스트도 그대로 이동한다', async () => {
  const { user } = await renderNav();

  await user.click(screen.getByText('Community'));

  expect(await screen.findByText('Community page')).toBeInTheDocument();
});
