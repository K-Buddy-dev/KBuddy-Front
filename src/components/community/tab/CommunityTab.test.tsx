import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import render from '@/utils/test/render';
import { CommunityTab } from './CommunityTab';

it('shows Buddy as the first community tab instead of Curated blog', async () => {
  await render(
    <MemoryRouter initialEntries={['/community']}>
      <CommunityTab />
    </MemoryRouter>
  );

  const tabs = screen.getAllByRole('button');

  expect(tabs[0]).toHaveTextContent('Buddy');
  expect(screen.queryByRole('button', { name: 'Curated blog' })).not.toBeInTheDocument();
});
