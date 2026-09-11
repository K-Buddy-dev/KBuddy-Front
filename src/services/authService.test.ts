import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authClient } from '@/api/axiosConfig';
import { authService } from './authService';
import { notificationService } from './notificationService';

vi.mock('./notificationService', () => ({
  notificationService: { deleteFcmToken: vi.fn().mockResolvedValue(undefined) },
}));

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

/**
 * 해제하지 않으면 로그아웃 후에도 그 계정의 푸시 알림을 계속 받는다.
 * 공용 기기에서는 다음 사용자에게 이전 사용자의 알림이 뜬다.
 */
describe('로그아웃 시 푸시 토큰', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    localStorage.setItem('fcmToken', 'device-token');
    vi.mocked(authClient.get).mockResolvedValue({ data: { data: { accessToken: 'fresh' } } } as never);
    vi.mocked(authClient.post).mockResolvedValue({ data: {} } as never);
  });

  it('이 기기의 푸시 토큰을 서버에서 해제한다', async () => {
    await authService.logout();

    expect(notificationService.deleteFcmToken).toHaveBeenCalledWith('device-token', 'fresh');
  });

  it('푸시 해제가 실패해도 로그아웃은 끝까지 진행된다', async () => {
    vi.mocked(notificationService.deleteFcmToken).mockRejectedValueOnce(new Error('network'));

    await authService.logout();

    expect(localStorage.getItem('basicUserData')).toBeNull();
    expect(authClient.defaults.headers.common['Authorization']).toBeUndefined();
  });
});
