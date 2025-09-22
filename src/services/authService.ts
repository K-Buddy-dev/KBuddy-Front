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
  logout: async () => {
    try {
      const { data } = await authService.refreshAccessToken();
      const accessToken = data?.accessToken as string | undefined;

      if (accessToken) {
        await authClient.post('/auth/logout', null, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 400) {
        // no-op: best-effort logout
      } else {
        console.error('logout flow error:', e);
      }
    } finally {
      // 4) 항상 클라이언트 상태 정리
      delete authClient.defaults.headers.common.Authorization; // 빈 문자열보다 delete가 안전
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
  refreshAccessToken: async () => {
    const response = await authClient.get('/auth/accessToken');
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
