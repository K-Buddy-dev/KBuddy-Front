import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import render from '@/utils/test/render';
import { DiscoveryDetailPage } from './DiscoveryDetailPage';

it('renders a discovery detail page with summary, body, CTA, and related items', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/discovery/1']}>
      <Routes>
        <Route path="/home" element={<div>Home route</div>} />
        <Route path="/service" element={<div>Service route</div>} />
        <Route path="/discovery/:id" element={<DiscoveryDetailPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getAllByText('Notice').length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: 'New to Korea? Start here' })).toBeInTheDocument();
  expect(screen.getByText('What you need to know')).toBeInTheDocument();
  expect(
    screen.getByText('Prepare your passport, ARC status, and current Korean address before booking help.')
  ).toBeInTheDocument();
  expect(screen.getByText('Related Discovery')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Explore related services' }));

  expect(screen.getByText('Service route')).toBeInTheDocument();
});

it('shows an empty state when the discovery item does not exist', async () => {
  await render(
    <MemoryRouter initialEntries={['/discovery/missing']}>
      <Routes>
        <Route path="/discovery/:id" element={<DiscoveryDetailPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: 'Discovery not found' })).toBeInTheDocument();
  expect(screen.getByText('This guide may have moved or expired.')).toBeInTheDocument();
});
