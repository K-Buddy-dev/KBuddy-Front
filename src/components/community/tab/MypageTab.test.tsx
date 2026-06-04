import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import render from '@/utils/test/render';
import { MypageTab } from './MypageTab';

it('shows my sale as the leftmost tab', async () => {
  await render(
    <MemoryRouter initialEntries={['/profile']}>
      <MypageTab />
    </MemoryRouter>
  );

  const tabs = screen.getAllByRole('button');

  expect(tabs[0]).toHaveTextContent('My sale');
});
