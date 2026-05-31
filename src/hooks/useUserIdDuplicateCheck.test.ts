import { act, renderHook } from '@testing-library/react';
import { authService } from '@/services';
import { useUserIdDuplicateCheck } from './useUserIdDuplicateCheck';

vi.mock('@/services', () => ({
  authService: {
    userIdCheck: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

it('shows an English message when the backend returns a duplicate user ID error in Korean', async () => {
  vi.mocked(authService.userIdCheck).mockRejectedValue({
    response: {
      data: {
        data: '이미 사용 중인 아이디입니다.',
      },
    },
  });

  const { result } = renderHook(() => useUserIdDuplicateCheck());

  await act(async () => {
    await expect(result.current.checkUserIdDuplicate('testuser')).rejects.toBeDefined();
  });

  expect(result.current.error).toBe('This user ID is already taken.');
});
