// src/services/http.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosInstance } from 'axios';
import { authService } from '@/services';

// 공용 axios 인스턴스
export const apiClient = axios.create({
  baseURL: 'https://api.k-buddy.kr/kbuddy/v1',
  headers: { 'Content-Type': 'application/json' },
});

export const authClient = axios.create({
  baseURL: 'https://api.k-buddy.kr/kbuddy/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 관리자 전용 axios 인스턴스
export const adminClient = axios.create({
  baseURL: 'https://api.k-buddy.kr/kbuddy/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

// 동시에 여러 401 발생 시 refresh 1회만 수행 (공유 Promise)
let inflightRefresh: Promise<string> | null = null;
const getFreshAccessToken = async (): Promise<string> => {
  if (!inflightRefresh) {
    inflightRefresh = authService
      .refreshAccessToken() // POST /auth/accessToken (withCredentials)
      .then(({ data }) => data.accessToken) // { accessToken }
      .finally(() => {
        inflightRefresh = null;
      });
  }
  return inflightRefresh;
};

// 401 처리 인터셉터 부착 헬퍼 (메모리/로컬 저장 없이, "그 요청에만" 토큰 부착)
const attach401Refresh = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as AxiosRequestConfig | undefined;
      const status = error.response?.status;

      // 원 요청 없거나, 이미 재시도했거나, refresh 자체면 패스
      if (!original || original._retry || original.url?.includes('/auth/accessToken')) {
        return Promise.reject(error);
      }

      if (status === 401) {
        original._retry = true;
        try {
          const token = await getFreshAccessToken();
          // 전역 저장 X: 이 재요청에만 헤더 부착
          original.headers = { ...(original.headers ?? {}), Authorization: `Bearer ${token}` };
          return client(original);
        } catch (e) {
          return Promise.reject(e);
        }
      }

      return Promise.reject(error);
    }
  );
};

// 두 클라이언트 모두에 적용 (서비스별로 어느 쪽을 쓰든 안전)
attach401Refresh(authClient);
attach401Refresh(apiClient);

// 관리자 전용 401 처리 (순환 참조 방지를 위해 동적 import 사용)
let inflightAdminRefresh: Promise<string> | null = null;
const getAdminAccessToken = async (): Promise<string> => {
  if (!inflightAdminRefresh) {
    inflightAdminRefresh = (async () => {
      const { adminService } = await import('@/services/adminService');
      const response = await adminService.refreshAccessToken();
      return response.data.accessToken;
    })().finally(() => {
      inflightAdminRefresh = null;
    });
  }
  return inflightAdminRefresh;
};

adminClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig | undefined;
    const status = error.response?.status;

    // 원 요청 없거나, 이미 재시도했거나, refresh 자체면 패스
    if (!original || original._retry || original.url?.includes('/admin/refres')) {
      return Promise.reject(error);
    }

    if (status === 401) {
      original._retry = true;
      try {
        const token = await getAdminAccessToken();
        // 전역 저장 X: 이 재요청에만 헤더 부착
        original.headers = { ...(original.headers ?? {}), Authorization: `Bearer ${token}` };
        return adminClient(original);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export { getFreshAccessToken }; // 필요 시 다른 곳에서 재사용 가능
