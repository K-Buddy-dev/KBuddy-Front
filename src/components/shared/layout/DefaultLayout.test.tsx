import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import render from '@/utils/test/render';
import { DefaultLayout } from './DefaultLayout';

it('hides bottom navigation on counselor profile creation route', async () => {
  await render(
    <MemoryRouter initialEntries={['/profile/counselor/create']}>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/profile/counselor/create" element={<div>Create counselor profile</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Create counselor profile')).toBeInTheDocument();
  expect(screen.queryByText('My page')).not.toBeInTheDocument();
});
