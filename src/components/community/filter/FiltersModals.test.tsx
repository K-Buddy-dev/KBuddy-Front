import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import render from '@/utils/test/render';
import { FiltersModal } from './FiltersModals';

it('keeps filter actions in a visible sticky footer', async () => {
  await render(
    <MemoryRouter>
      <FiltersModal onApply={vi.fn()} onClose={vi.fn()} />
    </MemoryRouter>
  );

  const actions = screen.getByTestId('filter-actions');

  expect(actions).toHaveClass('sticky');
  expect(actions).not.toHaveClass('absolute');
  expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
});
