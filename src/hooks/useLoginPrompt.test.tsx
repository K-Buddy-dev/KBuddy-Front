import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import render from '@/utils/test/render';
import { authClient } from '@/api/axiosConfig';
import { consumeReturnTo } from '@/utils/returnTo';
import { LoginPromptProvider, useLoginPrompt } from './useLoginPrompt';

const onAction = vi.fn();

function Consumer() {
  const { requireLogin } = useLoginPrompt();

  return (
    <button
      type="button"
      onClick={() => {
        if (!requireLogin('Log in to like posts.')) return;
        onAction();
      }}
    >
      Like
    </button>
  );
}

const renderConsumer = () =>
  render(
    <MemoryRouter initialEntries={['/community/detail/1']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/community/detail/:id" element={<Consumer />} />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

afterEach(() => {
  delete authClient.defaults.headers.common.Authorization;
});

it('게스트가 누르면 동작 대신 로그인 안내를 띄운다', async () => {
  const { user } = await renderConsumer();

  await user.click(screen.getByRole('button', { name: 'Like' }));

  expect(screen.getByText('Log in to like posts.')).toBeInTheDocument();
  expect(onAction).not.toHaveBeenCalled();
});

it('로그인 사용자는 안내 없이 그대로 실행된다', async () => {
  authClient.defaults.headers.common['Authorization'] = 'Bearer token';
  const { user } = await renderConsumer();

  await user.click(screen.getByRole('button', { name: 'Like' }));

  expect(onAction).toHaveBeenCalled();
  expect(screen.queryByText('Log in to like posts.')).not.toBeInTheDocument();
});

it('안내에서 로그인을 선택하면 로그인 화면으로 이동하고 돌아올 위치를 기억한다', async () => {
  const { user } = await renderConsumer();

  await user.click(screen.getByRole('button', { name: 'Like' }));
  await user.click(screen.getByRole('button', { name: 'Log in or sign up' }));

  expect(await screen.findByText('Login page')).toBeInTheDocument();
  expect(consumeReturnTo()).toBe('/community/detail/1');
});

it('나중에 하기를 누르면 원래 화면에 그대로 머문다', async () => {
  const { user } = await renderConsumer();

  await user.click(screen.getByRole('button', { name: 'Like' }));
  await user.click(screen.getByRole('button', { name: 'Not now' }));

  expect(screen.queryByText('Log in to like posts.')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument();
  expect(onAction).not.toHaveBeenCalled();
});
