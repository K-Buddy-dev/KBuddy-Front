import { screen } from '@testing-library/react';
import { Button } from './Button';
import render from '@/utils/test/render';

it('className prop으로 넘긴 class가 적용된다.', () => {
  render(<Button className="my-class">test</Button>);

  const button = screen.getByRole('button');
  expect(button).toHaveClass('my-class');
});

it('버튼 클릭 시 onClick prop으로 넘긴 함수가 실행된다.', async () => {
  const spy = vi.fn();
  const { user } = await render(<Button onClick={spy}>test</Button>);

  const button = screen.getByRole('button');
  await user.click(button);
  expect(spy).toHaveBeenCalled();
});
