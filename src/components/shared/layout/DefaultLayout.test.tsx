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

it('keeps bottom navigation above page content', async () => {
  await render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/home" element={<div>Home content</div>} />
          </Route>
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  const bottomNavigationLayer = screen.getByText('My page').closest('[data-testid="bottom-navigation-layer"]');

  expect(bottomNavigationLayer).toHaveClass('z-30');
});

it('shows a persistent Instagram support floating button', async () => {
  await render(
    <MemoryRouter initialEntries={['/home']}>
      <LoginPromptProvider>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/home" element={<div>Home content</div>} />
          </Route>
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  const instagramLink = screen.getByRole('link', { name: 'Contact us on Instagram' });

  expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/kbuddy_official/');
  expect(instagramLink).toHaveAttribute('target', '_blank');
  expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
  expect(instagramLink).toHaveClass('fixed', 'right-4', 'bottom-24', 'z-40');
});

it('moves the Instagram support button above the community post action', async () => {
  await render(
    <MemoryRouter initialEntries={['/community']}>
      <LoginPromptProvider>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/community" element={<div>Community content</div>} />
          </Route>
        </Routes>
      </LoginPromptProvider>
    </MemoryRouter>
  );

  const instagramLink = screen.getByRole('link', { name: 'Contact us on Instagram' });

  expect(instagramLink).toHaveClass('bottom-[156px]');
});
