import { createRef } from 'react';
import { screen } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import render from '@/utils/test/render';
import { CommentInput } from './CommentInput';

beforeEach(() => {
  localStorage.clear();
});

const renderInput = () =>
  render(
    <CommentInput
      editId={null}
      editText=""
      onCommentSubmit={vi.fn()}
      onCommentEdit={vi.fn()}
      inputRef={createRef<HTMLInputElement>()}
    />
  );

/**
 * 게시글 상세가 공개되면서 비로그인 사용자에게도 댓글 입력창이 렌더된다.
 * 캐시된 프로필이 없을 때 터지면 상세 페이지 전체가 무너진다.
 */
it('비로그인 사용자에게도 기본 프로필로 렌더된다', async () => {
  await renderInput();

  expect(screen.getByAltText('Profile')).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/comment/i)).toBeInTheDocument();
});

it('로그인 사용자는 저장된 프로필 이미지를 쓴다', async () => {
  localStorage.setItem('basicUserData', JSON.stringify({ uuid: 'u1', profileImageUrl: 'https://example.com/me.png' }));

  await renderInput();

  expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'https://example.com/me.png');
});
