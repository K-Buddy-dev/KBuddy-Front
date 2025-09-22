import { apiClient, authClient } from '@/api/axiosConfig';
import { OauthRequest, ProfileEditFormData } from '@/types';
import axios from 'axios';

export interface LoginRequest {
  emailOrUserId: string;
  password: string;
}

export interface EmailVerifyRequest {
  email: string;
}

export interface SendCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  password?: string;
  birthDate?: string;
  country?: string | null;
  gender?: string | null;
  oAuthUid?: string | number;
  oAuthCategory?: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
}

export interface UserIdCheckRequest {
  userId: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await authClient.post('/auth/login', data);
    return response.data;
  },
  refreshAccessToken: async () => {
    const response = await authClient.get('/auth/accessToken');
    return response.data;
  },
  logout: async (): Promise<void> => {
    try {
      // 1) 로그아웃 직전에 1회 토큰 발급 시도 (쿠키 없으면 여기서 실패)
      const { data } = await authService.refreshAccessToken();
      const accessToken = data?.accessToken as string | undefined;

      if (accessToken) {
        // 2) 전역 저장 없이 "이 요청에만" Authorization 부착하여 서버 로그아웃
        await authClient.post('/auth/logout', null, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
      }
      // accessToken 없으면 서버엔 보낼 게 없음 → 클라 정리로 진행
    } catch (e) {
      // refresh 쿠키가 없을 때 서버가 400을 주는 환경: 이미 로그아웃 상태로 간주하고 무시
      if (axios.isAxiosError(e) && e.response?.status === 400) {
        // no-op (best-effort logout)
      } else {
        // 그 외 에러만 로깅
        console.error('logout flow error:', e);
      }
    } finally {
      // 3) 항상 클라이언트 상태 정리 (빈 문자열 대신 delete)
      delete authClient.defaults.headers.common.Authorization;
      // 필요 시 여기에 전역 상태/캐시 초기화 추가
      // queryClient.clear(); resetStores(); 등
    }
  },
  emailVerify: async (data: EmailVerifyRequest) => {
    const response = await apiClient.post('/auth/email/check', data);
    return response.data;
  },
  sendCode: (data: SendCodeRequest) => {
    apiClient.post('/auth/email/send', data);
  },
  verifyCode: async (data: VerifyCodeRequest) => {
    const response = await apiClient.post('/auth/email/code', data);
    return response.data;
  },
  userIdCheck: async (data: UserIdCheckRequest) => {
    const response = await apiClient.post('/auth/userId/check', data);
    return response.data;
  },
  signup: async (data: SignupRequest) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  oauthCheck: async (data: OauthRequest) => {
    const response = await apiClient.post('/auth/oauth/check', data);
    return response.data;
  },
  oauthRegister: async (data: SignupRequest) => {
    const response = await apiClient.post('/auth/oauth/register', data);
    return response.data;
  },
  oauthLogin: async (data: OauthRequest) => {
    const response = await authClient.post('/auth/oauth/login', data);
    return response.data;
  },
  getUserDrafts: async () => {
    const response = await authClient.get('/user/drafts');
    return response.data;
  },
  getUserProfile: async () => {
    const response = await authClient.get('/user');
    return response.data;
  },
  editProfile: async (data: ProfileEditFormData) => {
    const formData = new FormData();

    const { bio, profileImage } = data;
    if (bio) {
      formData.append('bio', JSON.stringify({ bio }));
    }
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    const response = await authClient.patch('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deleteAccount: async () => {
    const response = await authClient.delete('/auth/account');
    authClient.defaults.headers.common['Authorization'] = '';
    return response.data;
  },
};
