import apiClient from '@/api/axiosConfig';
import { OauthRequest } from '@/types';

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
  birthDate: string;
  country: string;
  gender: string;
  oAuthUid?: string | number;
  oAuthCategory?: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
}

export interface UserIdCheckRequest {
  userId: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
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
    const response = await apiClient.post('/auth/oauth/login', data);
    return response.data;
  },
};
