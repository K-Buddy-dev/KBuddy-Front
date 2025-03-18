import { authService } from '@/services';
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.k-buddy.kr/kbuddy/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authClient = axios.create({
  baseURL: 'https://api.k-buddy.kr/kbuddy/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originRequest = error.config;
    if (error.response?.status === 401 && !originRequest._retry) {
      originRequest._retry = true;
      try {
        const { data } = await authService.refreshAccessToken();
        const { accessToken } = data;
        authClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return authClient(originRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
