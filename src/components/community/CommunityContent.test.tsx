import { screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import render from '@/utils/test/render';
import { CommunityContent } from './CommunityContent';

const LEXICAL_TEXT = (text: string) =>
  JSON.stringify({
    root: {
      children: [
        {
          children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });

it('에디터 형식의 본문을 그대로 보여준다', async () => {
  await render(<CommunityContent content={LEXICAL_TEXT('정상 본문')} />);

  expect(await screen.findByText('정상 본문')).toBeInTheDocument();
});

/**
 * 게시글 본문이 에디터 형식이 아니면 예전에는 폴백까지 예외를 던져 화면 전체가 백지가 됐다.
 * 상세 화면은 비로그인 사용자에게도 열려 있으므로 어떤 본문이 와도 렌더링은 살아 있어야 한다.
 */
it('에디터 형식이 아닌 평문 본문도 백지 없이 보여준다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});

  await render(<CommunityContent content="Readable without login." />);

  expect(await screen.findByText('Readable without login.')).toBeInTheDocument();
});

it('본문이 비어 있어도 예외 없이 렌더링한다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});

  const { container } = await render(<CommunityContent content="" />);

  expect(container).toBeInTheDocument();
});
