import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EmailVerifyStateContext } from '@/hooks/useEmailVerifyContext';
import render from '@/utils/test/render';
import { SignupFormPage } from './SignupFormPage';

vi.mock('@/services', () => ({
  authService: {
    signup: vi.fn(),
    login: vi.fn(),
    userIdCheck: vi.fn(),
  },
}));

it('renders signup form in readable sections without showing a terms error upfront', async () => {
  await render(
    <EmailVerifyStateContext.Provider
      value={{
        email: 'test@example.com',
        error: '',
        isLoading: false,
        isVerify: true,
      }}
    >
      <MemoryRouter initialEntries={['/signup/form']}>
        <SignupFormPage />
      </MemoryRouter>
    </EmailVerifyStateContext.Provider>
  );

  expect(screen.getByRole('heading', { name: 'Personal information' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Account details' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Preferences' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Security' })).toBeInTheDocument();
  expect(screen.queryByRole('radio', { name: 'Prefer not to say' })).not.toBeInTheDocument();
  expect(screen.queryByText('Please agree to the terms and conditions')).not.toBeInTheDocument();
});
