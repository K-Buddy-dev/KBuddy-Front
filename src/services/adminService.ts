import { adminClient } from '@/api/axiosConfig';
import {
  PaginationRequest,
  UserListResponse,
  UserStatsResponse,
  PostReportsResponse,
  PaymentListResponse,
  ConfirmDepositRequest,
  CancelPaymentRequest,
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

  getPayments: ({ page = 0, size = 50, status }: { page?: number; size?: number; status?: string } = {}) => {
    return adminClient.get<PaymentListResponse>('/admin/payments', {
      params: {
        page,
        size,
        ...(status ? { status } : {}),
      },
    });
  },

  confirmDeposit: (paymentId: number, data?: ConfirmDepositRequest) => {
    return adminClient.patch(`/admin/payments/${paymentId}/confirm-deposit`, data);
  },

  cancelPayment: (paymentId: number, data: CancelPaymentRequest) => {
    return adminClient.patch(`/admin/payments/${paymentId}/cancel`, data);
  },

  // TODO: Add more admin services
  // blockUser: (userId: number) => authClient.post(`/admin/users/${userId}/block`),
  // unblockUser: (userId: number) => authClient.post(`/admin/users/${userId}/unblock`),
  // deleteUser: (userId: number) => authClient.delete(`/admin/users/${userId}`),
};
