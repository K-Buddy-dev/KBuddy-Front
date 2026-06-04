import { render, screen } from '@testing-library/react';
import { SwiperList, SwiperListWrapper } from './SwiperList';

vi.mock('swiper/react', () => ({
  Swiper: ({ children, spaceBetween }: { children: React.ReactNode; spaceBetween: number }) => (
    <div data-testid="featured-posts-swiper" data-space-between={spaceBetween}>
      {children}
    </div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('swiper/modules', () => ({
  Navigation: {},
}));

it('uses the home section width when rendered in the home layout', () => {
  render(<SwiperListWrapper layout="home">Featured content</SwiperListWrapper>);

  const section = screen.getByLabelText('Featured posts');
  const panel = screen.getByText('Featured posts').closest('div');

  expect(section).toHaveClass('px-5');
  expect(section).not.toHaveClass('pb-5');
  expect(panel).toHaveClass('w-full');
  expect(panel).not.toHaveClass('sm:w-[600px]');
});

it('uses wider spacing between featured post cards', () => {
  render(<SwiperList cards={[]} layout="home" onBookmark={vi.fn()} onLike={vi.fn()} />);

  expect(screen.getByTestId('featured-posts-swiper')).toHaveAttribute('data-space-between', '24');
});
