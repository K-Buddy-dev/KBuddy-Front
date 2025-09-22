import { authService } from '@/services';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

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

declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

let inflightRefresh: Promise<string> | null = null;
const getFreshAccessToken = async () => {
  if (!inflightRefresh) {
    inflightRefresh = authService
      .refreshAccessToken()
      .then(({ data }) => data.accessToken)
      .finally(() => {
        inflightRefresh = null;
      });
  }
  return inflightRefresh;
};

authClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig | undefined;
    const status = error.response?.status;

    if (!original || original._retry || original.url?.includes('/accessToken')) {
      return Promise.reject(error);
    }

    if (status === 401) {
      original._retry = true;
      try {
        const token = await getFreshAccessToken();
        original.headers = { ...(original.headers ?? {}), Authorization: `Bearer ${token}` };
        return authClient(original);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
