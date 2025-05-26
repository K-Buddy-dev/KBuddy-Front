import render from '@/utils/test/render';
import { TextField } from './TextField';
import { screen } from '@testing-library/dom';

it('prop으로 전달한 onChange가 실행된다', async () => {
  const spy = vi.fn();
  const { user } = await render(<TextField id="test" label="test" onChange={spy} />);

  const textInput = screen.getByLabelText('test');
  await user.type(textInput, 'test');

  const lastEvent = spy.mock.calls.at(-1)?.[0];
  expect(lastEvent.target.value).toEqual('test');
});
