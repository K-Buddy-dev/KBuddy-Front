import { apiClient, authClient } from '@/api/axiosConfig';
import {
  EmailVerifyRequest,
  LoginRequest,
  OauthRequest,
  SendCodeRequest,
  SignupRequest,
  UserIdCheckRequest,
  VerifyCodeRequest,
} from '@/types';

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await authClient.post('/auth/login', data);
    return response.data;
  },
  logout: async () => {
    const response = await authClient.post('/auth/logout');
    authClient.defaults.headers.common['Authorization'] = '';
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
    const response = await authClient.post('/auth/oauth/login', data);
    return response.data;
  },
  refreshAccessToken: async () => {
    const response = await authClient.get('/auth/accessToken');
    return response.data;
  },
};
