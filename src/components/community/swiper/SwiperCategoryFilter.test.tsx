import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BUDDY_CATEGORIES } from '@/constants';
import render from '@/utils/test/render';
import { CategoryFilterSwiper } from './SwiperCategoryFilter';

it('renders buddy categories when category options are provided', async () => {
  await render(
    <MemoryRouter>
      <CategoryFilterSwiper categories={BUDDY_CATEGORIES} onCategoryChange={vi.fn()} />
    </MemoryRouter>
  );

  expect(screen.getByRole('button', { name: 'Language Exchange' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Restaurant' })).not.toBeInTheDocument();
});
