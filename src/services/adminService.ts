import { adminClient } from '@/api/axiosConfig';
import {
  PaginationRequest,
  UserListResponse,
  UserStatsResponse,
  PostReportsResponse,
  UserReportsResponse,
} from '@/types/admin';

export interface AdminLoginRequest {
  id: string;
  password: string;
}

export interface AdminLoginData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpireTime: number;
  refreshTokenExpireTime: number;
}

export interface AdminLoginResponse {
  timestamp: string;
  status: number;
  code: string;
  path: string;
  data: AdminLoginData;
  details: string[];
}

export const adminService = {
  // Admin login (use adminClient for cookie support)
  login: async (data: AdminLoginRequest) => {
    const response = await adminClient.post<AdminLoginResponse>('/admin/login', data);
    return response.data;
  },

  // Admin refresh access token
  refreshAccessToken: async () => {
    const response = await adminClient.get<AdminLoginResponse>('/admin/refresh');
    return response.data;
  },

  // Get user list with pagination
  getUserList: (params: PaginationRequest) => {
    return adminClient.get<UserListResponse>('/admin/subscribers/list', {
      params: {
        page: params.page,
        size: params.size,
        sort: params.sort?.join(','),
      },
    });
  },

  // Get user statistics
  getUserStats: () => {
    return adminClient.get<UserStatsResponse>('/admin/subscribers/stats');
  },

  // Get post reports
  getPostReports: () => {
    return adminClient.get<PostReportsResponse>('/admin/reports/posts');
  },

  // Get user reports
  getUserReports: () => {
    return adminClient.get<UserReportsResponse>('/admin/reports/users');
  },

  // TODO: Add more admin services
  // blockUser: (userId: number) => authClient.post(`/admin/users/${userId}/block`),
  // unblockUser: (userId: number) => authClient.post(`/admin/users/${userId}/unblock`),
  // deleteUser: (userId: number) => authClient.delete(`/admin/users/${userId}`),
};
