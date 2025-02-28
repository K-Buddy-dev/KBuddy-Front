import apiClient from '@/api/axiosConfig';

export interface LoginRequest {
  emailOrUserId: string;
  password: string;
}

export interface EmailVerifyRequest {
  email: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  emailVerify: async (data: EmailVerifyRequest) => {
    const response = await apiClient.post('/auth/email/send', data);
    return response.data;
  },
};
