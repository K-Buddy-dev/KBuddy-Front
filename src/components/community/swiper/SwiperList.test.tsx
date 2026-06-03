import { render, screen } from '@testing-library/react';
import { SwiperListWrapper } from './SwiperList';

it('uses the home section width when rendered in the home layout', () => {
  render(<SwiperListWrapper layout="home">Featured content</SwiperListWrapper>);

  const section = screen.getByLabelText('Featured posts');
  const panel = screen.getByText('Featured posts').closest('div');

  expect(section).toHaveClass('px-5');
  expect(section).not.toHaveClass('pb-5');
  expect(panel).toHaveClass('w-full');
  expect(panel).not.toHaveClass('sm:w-[600px]');
});
