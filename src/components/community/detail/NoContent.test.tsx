import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, expect, it } from 'vitest';
import render from '@/utils/test/render';
import { authClient } from '@/api/axiosConfig';
import { LoginPromptProvider } from '@/hooks/useLoginPrompt';
import { NoContent } from './NoContent';

const renderNoContent = () =>
  render(
    <MemoryRouter initialEntries={['/community']}>
      <LoginPromptProvider>
        <Routes>
          <Route path="/community" element={<NoContent type="blog" />} />
          <Route path="/community/post" element={<div>Write page</div>} />
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

afterEach(() => {
  delete authClient.defaults.headers.common.Authorization;
});

it('게스트가 글쓰기를 누르면 이동 대신 로그인 안내를 띄운다', async () => {
  const { user } = await renderNoContent();

  await user.click(screen.getByRole('link', { name: 'Write a blog' }));

  expect(screen.getByText('Log in to write a post.')).toBeInTheDocument();
  expect(screen.queryByText('Write page')).not.toBeInTheDocument();
});

it('로그인 사용자는 글쓰기 화면으로 이동한다', async () => {
  authClient.defaults.headers.common['Authorization'] = 'Bearer token';
  const { user } = await renderNoContent();

  await user.click(screen.getByRole('link', { name: 'Write a blog' }));

  expect(await screen.findByText('Write page')).toBeInTheDocument();
});

/** 링크 시맨틱은 유지되어야 한다 (href, 새 탭 열기, 접근성). */
it('로그인 여부와 관계없이 링크로 유지된다', async () => {
  await renderNoContent();

  expect(screen.getByRole('link', { name: 'Write a blog' })).toHaveAttribute('href', '/community/post');
});
