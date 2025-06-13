import { apiClient, authClient } from '@/api/axiosConfig';
import { LoginRequest, OauthRequest, SignupRequest } from '@/types';

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
