import { act, renderHook } from '@testing-library/react';
import { authClient } from '@/api/axiosConfig';
import { authService } from '@/services';
import { useSignup } from './useSignup';

vi.mock('@/api/axiosConfig', () => ({
  authClient: {
    defaults: {
      headers: {
        common: {},
      },
    },
  },
}));

vi.mock('@/services', () => ({
  authService: {
    login: vi.fn(),
    signup: vi.fn(),
  },
}));

beforeEach(() => {
  localStorage.clear();
  vi.mocked(authService.signup).mockResolvedValue({ data: { accessToken: 'access-token' } });
  vi.mocked(authService.login).mockResolvedValue({ data: { accessToken: 'login-access-token' } });
  authClient.defaults.headers.common = {};
});

it('sends firstName and lastName in the signup request body', async () => {
  const { result } = renderHook(() => useSignup());

  await act(async () => {
    await result.current.signup({
      birthDate: { day: '2', month: '5', year: '1998' },
      confirmPassword: 'Password!1',
      country: 'KR',
      email: 'john@example.com',
      firstName: 'John',
      gender: null,
      lastName: 'Doe',
      password: 'Password!1',
      userId: 'john123',
    });
  });

  expect(authService.signup).toHaveBeenCalledWith(
    expect.objectContaining({
      birthDate: '19980502',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Password!1',
      userId: 'john123',
    })
  );
});
