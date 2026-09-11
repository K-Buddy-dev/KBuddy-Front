import { render, screen } from '@testing-library/react';
import { SwiperList, SwiperListWrapper } from './SwiperList';

vi.mock('swiper/react', () => ({
  Swiper: ({
    breakpoints,
    children,
    slidesPerView,
    spaceBetween,
  }: {
    breakpoints?: Record<number, { slidesPerView?: number }>;
    children: React.ReactNode;
    slidesPerView: number;
    spaceBetween: number;
  }) => (
    <div
      data-testid="featured-posts-swiper"
      data-breakpoint-slides-per-view={JSON.stringify(
        Object.fromEntries(Object.entries(breakpoints ?? {}).map(([key, value]) => [key, value.slidesPerView]))
      )}
      data-slides-per-view={slidesPerView}
      data-space-between={spaceBetween}
    >
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

it('shows one featured post card per swipe across layouts and breakpoints', () => {
  render(<SwiperList cards={[]} layout="home" onBookmark={vi.fn()} onLike={vi.fn()} />);

  const swiper = screen.getByTestId('featured-posts-swiper');

  expect(swiper).toHaveAttribute('data-slides-per-view', '1');
  expect(JSON.parse(swiper.getAttribute('data-breakpoint-slides-per-view') || '{}')).toEqual({
    '360': 1,
    '400': 1,
    '450': 1,
    '500': 1,
    '550': 1,
    '600': 1,
  });
});
