import { screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import render from '@/utils/test/render';
import { Navbar } from './Navbar';
import { notificationService } from '@/services/notificationService';

vi.mock('@/services/notificationService', () => ({
  notificationService: {
    getUnreadCount: vi.fn(),
  },
}));

beforeEach(() => {
  vi.mocked(notificationService.getUnreadCount).mockResolvedValue(0);
});

it('navigates home when the logo is clicked in the search navbar', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/service']}>
      <Routes>
        <Route path="/service" element={<Navbar withSearch />} />
        <Route path="/home" element={<div>Home route</div>} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Go to home' }));

  expect(screen.getByText('Home route')).toBeInTheDocument();
});

it('navigates home when the logo is clicked in the basic navbar', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/profile']}>
      <Routes>
        <Route path="/profile" element={<Navbar withSearch={false} />} />
        <Route path="/home" element={<div>Home route</div>} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Go to home' }));

  expect(screen.getByText('Home route')).toBeInTheDocument();
});

it('shows the settings action only when a settings handler is provided', async () => {
  const onClickSettings = vi.fn();
  const { user } = await render(
    <MemoryRouter>
      <Navbar withSearch={false} onClickSettings={onClickSettings} />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Open settings' }));

  expect(onClickSettings).toHaveBeenCalledTimes(1);
});

it('shows the notification action in the search navbar', async () => {
  await render(
    <MemoryRouter>
      <Navbar withSearch />
    </MemoryRouter>
  );

  expect(screen.getByRole('button', { name: 'Open notifications' })).toBeInTheDocument();
});

it('shows the notification action in the basic navbar', async () => {
  await render(
    <MemoryRouter>
      <Navbar withSearch={false} />
    </MemoryRouter>
  );

  expect(screen.getByRole('button', { name: 'Open notifications' })).toBeInTheDocument();
});

it('navigates to notifications when the notification action is clicked', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/service']}>
      <Routes>
        <Route path="/service" element={<Navbar withSearch />} />
        <Route path="/notifications" element={<div>Notifications route</div>} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Open notifications' }));

  expect(screen.getByText('Notifications route')).toBeInTheDocument();
});

it('shows the unread notification count', async () => {
  vi.mocked(notificationService.getUnreadCount).mockResolvedValue(3);

  await render(
    <MemoryRouter>
      <Navbar withSearch={false} />
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument());
});

it('hides the settings action when no settings handler is provided', async () => {
  await render(
    <MemoryRouter>
      <Navbar withSearch={false} />
    </MemoryRouter>
  );

  expect(screen.queryByRole('button', { name: 'Open settings' })).not.toBeInTheDocument();
});
