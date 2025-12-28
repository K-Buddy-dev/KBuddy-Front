// Admin User Types
export interface AdminUser {
  userId: number;
  username: string;
  email: string;
  gender: 'M' | 'F';
  active: boolean;
  createdAt: string;
}

// Pagination Request
export interface PaginationRequest {
  page: number;
  size: number;
  sort?: string[];
}

// API Response Wrapper
export interface AdminApiResponse<T> {
  timestamp: string;
  status: number;
  code: string | null;
  path: string | null;
  data: T;
  details: string[];
}

// User List Response Data
export interface UserListData {
  totalElements: number;
  page: number;
  size: number;
  subscribers: AdminUser[];
}

// User List Response
export type UserListResponse = AdminApiResponse<UserListData>;

// User Stats Data
export interface UserStatsData {
  totalSubscribers: number;
  maleSubscribers: number;
  femaleSubscribers: number;
}

// User Stats Response
export type UserStatsResponse = AdminApiResponse<UserStatsData>;

// Post Report
export interface PostReport {
  postType: 'BLOG' | 'COMMUNITY';
  postId: number;
  title: string;
  writerId: number;
  writerUsername: string;
  writerEmail: string;
  reportCount: number;
}

// Post Reports Data
export interface PostReportsData {
  totalPosts: number;
  posts: PostReport[];
}

// Post Reports Response
export type PostReportsResponse = AdminApiResponse<PostReportsData>;

// User Report
export interface UserReport {
  userId: number;
  username: string;
  email: string;
  totalReports: number;
  posts: PostReport[];
}

// User Reports Data
export interface UserReportsData {
  totalUsers: number;
  users: UserReport[];
}

// User Reports Response
export type UserReportsResponse = AdminApiResponse<UserReportsData>;
