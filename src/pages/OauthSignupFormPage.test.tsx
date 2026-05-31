import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import render from '@/utils/test/render';
import { OauthSignupFormPage } from './OauthSignupFormPage';
import { authService } from '@/services';
import { useSocialStore } from '@/store';

vi.mock('@/services', () => ({
  authService: {
    oauthRegister: vi.fn(),
    oauthLogin: vi.fn(),
    userIdCheck: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  useSocialStore.setState({
    email: 'dpfprtus@gmail.com',
    oAuthUid: '109095257805001202912',
    oAuthCategory: 'GOOGLE',
    firstName: '',
    lastName: '',
  });
  vi.mocked(authService.oauthRegister).mockResolvedValue({ data: { accessToken: 'access-token' } });
  vi.mocked(authService.userIdCheck).mockResolvedValue({});
});

it('sends first and last name entered in the OAuth signup form', async () => {
  const { user } = await render(
    <MemoryRouter initialEntries={['/oauth/signup/form']}>
      <OauthSignupFormPage />
    </MemoryRouter>
  );

  await user.type(screen.getByLabelText('First name'), 'Jenny');
  await user.type(screen.getByLabelText('Last name'), 'Kim');
  await user.type(screen.getByLabelText('User ID'), 'testuser');

  await user.click(screen.getByText('Year'));
  await user.click(screen.getByText('2003'));
  await user.click(screen.getByText('Month'));
  await user.click(screen.getByText('9'));
  await user.click(screen.getByText('Day'));
  await user.click(screen.getByText('7'));
  await user.click(screen.getByText('Select your nationality'));
  await user.click(screen.getByText('South Korea'));
  await user.click(screen.getByText('Male'));
  await user.click(screen.getByLabelText(/I consent to the/i));

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Create account' })).toBeEnabled();
  });

  await user.click(screen.getByRole('button', { name: 'Create account' }));

  await waitFor(() => {
    expect(authService.oauthRegister).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Jenny',
        lastName: 'Kim',
        email: 'dpfprtus@gmail.com',
        userId: 'testuser',
        birthDate: '030907',
        country: 'KR',
        gender: 'M',
        oAuthUid: '109095257805001202912',
        oAuthCategory: 'GOOGLE',
      })
    );
  });
});
