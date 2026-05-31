import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import render from '@/utils/test/render';
import { SettingPage } from './SettingPage';
import { authService } from '@/services';

vi.mock('@/services', () => ({
  authService: {
    deleteAccount: vi.fn(),
    logout: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

it('renders settings as grouped account and danger sections', async () => {
  await render(
    <MemoryRouter initialEntries={['/settings']}>
      <SettingPage />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: 'Account' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Danger zone' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Contact us' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Block user list' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Delete account' })).toHaveClass('text-text-danger-default');
  expect(screen.getByText('Version 1.0.0')).toBeInTheDocument();
});

it('opens the Typeform contact form when contact us is clicked', async () => {
  const originalLocation = window.location;
  const assignMock = vi.fn();
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: {
      ...originalLocation,
      assign: assignMock,
    },
  });

  const { user } = await render(
    <MemoryRouter initialEntries={['/settings']}>
      <SettingPage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Contact us' }));

  expect(assignMock).toHaveBeenCalledWith('https://0ntm7gxvv3y.typeform.com/to/r75u0iEC');

  Object.defineProperty(window, 'location', {
    configurable: true,
    value: originalLocation,
  });
});

it('navigates to the block user list', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/settings']}>
      <Routes>
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/block-user" element={<div>Block user route</div>} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Block user list' }));

  expect(screen.getByText('Block user route')).toBeInTheDocument();
});

it('asks for confirmation before deleting an account', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/settings']}>
      <SettingPage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Delete account' }));

  expect(authService.deleteAccount).not.toHaveBeenCalled();
  expect(screen.getByRole('dialog', { name: 'Delete account' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Cancel' }));

  expect(screen.queryByRole('dialog', { name: 'Delete account' })).not.toBeInTheDocument();
  expect(authService.deleteAccount).not.toHaveBeenCalled();
});

it('deletes an account only after confirming in the dialog', async () => {
  vi.mocked(authService.deleteAccount).mockResolvedValue({});

  const { user } = await render(
    <MemoryRouter initialEntries={['/settings']}>
      <SettingPage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: 'Delete account' }));
  await user.click(screen.getByRole('button', { name: 'Yes, delete account' }));

  expect(authService.deleteAccount).toHaveBeenCalledTimes(1);
});
