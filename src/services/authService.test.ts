import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authClient } from '@/api/axiosConfig';
import { authService } from './authService';

vi.mock('@/api/axiosConfig', () => ({
  apiClient: { post: vi.fn(), get: vi.fn() },
  authClient: {
    defaults: { headers: { common: {} as Record<string, string> } },
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('로그아웃', () => {
  beforeEach(() => {
    localStorage.clear();
    authClient.defaults.headers.common['Authorization'] = 'Bearer token';
    localStorage.setItem('basicUserData', JSON.stringify({ uuid: 'user-1' }));
    localStorage.setItem('fcmToken', 'fcm');
    localStorage.setItem('kBuddyId', 'saved-id');
  });

  /**
   * 로그아웃 후에도 게스트로 계속 둘러볼 수 있으므로, 이전 사용자 신원이 남으면
   * 본인 글 판별이 어긋나 수정/삭제 메뉴가 잘못 노출된다.
   */
  it('이전 사용자의 신원 정보를 남기지 않는다', async () => {
    vi.mocked(authClient.get).mockRejectedValue(new Error('no cookie'));

    await authService.logout();

    expect(localStorage.getItem('basicUserData')).toBeNull();
    expect(localStorage.getItem('fcmToken')).toBeNull();
    expect(authClient.defaults.headers.common['Authorization']).toBeUndefined();
  });

  it('저장된 아이디는 유지한다', async () => {
    vi.mocked(authClient.get).mockRejectedValue(new Error('no cookie'));

    await authService.logout();

    expect(localStorage.getItem('kBuddyId')).toBe('saved-id');
  });
});

describe('회원 탈퇴', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('basicUserData', JSON.stringify({ uuid: 'user-1' }));
    localStorage.setItem('kBuddyId', 'saved-id');
    vi.mocked(authClient.delete).mockResolvedValue({ data: {} } as never);
  });

  it('저장된 아이디까지 모두 지운다', async () => {
    await authService.deleteAccount();

    expect(localStorage.getItem('basicUserData')).toBeNull();
    expect(localStorage.getItem('kBuddyId')).toBeNull();
  });
});
