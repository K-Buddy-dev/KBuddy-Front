import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import render from '@/utils/test/render';
import { LoginPromptProvider } from '@/hooks/useLoginPrompt';
import { DefaultLayout } from './DefaultLayout';

it('hides bottom navigation on counselor profile creation route', async () => {
  await render(
    <MemoryRouter initialEntries={['/profile/counselor/create']}>
      <LoginPromptProvider>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/profile/counselor/create" element={<div>Create counselor profile</div>} />
          </Route>
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(screen.getByText('Create counselor profile')).toBeInTheDocument();
  expect(screen.queryByText('My page')).not.toBeInTheDocument();
});

it('keeps bottom navigation on discovery detail route', async () => {
  await render(
    <MemoryRouter initialEntries={['/discovery/1']}>
      <LoginPromptProvider>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/discovery/:id" element={<div>Discovery detail</div>} />
          </Route>
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  expect(screen.getByText('Discovery detail')).toBeInTheDocument();
  expect(screen.getByText('My page')).toBeInTheDocument();
});
