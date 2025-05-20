import { PostStatus } from './post';

export const CATEGORIES = [
  { id: 0, name: 'Restaurant' },
  { id: 1, name: 'Shopping' },
  { id: 2, name: 'Lodging' },
  { id: 3, name: 'Art' },
  { id: 4, name: 'Transportation' },
  { id: 5, name: 'Daily Life' },
  { id: 6, name: 'Cafe/Dessert' },
  { id: 7, name: 'Attraction' },
  { id: 8, name: 'Nature' },
  { id: 9, name: 'Health' },
  { id: 10, name: 'Others' },
] as const;
export interface Blog {
  id: number;
  title: string;
  description: string;
  categoryId: number[];
  images?: File[];
}

// 응답 데이터 타입
export interface Community {
  id: number;
  writerId: number;
  categoryId: number[] | number;
  title: string;
  description: string;
  viewCount: number;
  heartCount: number;
  isHearted: boolean;
  isBookmarked: boolean;
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  blogId: number;
  writerId: number;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

export interface CommunityDetail {
  id: number;
  writerId: number;
  categoryId: number[] | number;
  title: string;
  description: string;
  viewCount: number;
  createdAt: string;
  modifiedAt: string;
  images: {
    id: number;
    type: string;
    name: string;
    url: string;
  }[];
  comments: Comment[];
  heartCount: number;
  commentCount: number;
  isBookmarked: boolean;
  isHearted: boolean;
  status: string;
}

interface CommunityListData {
  nextId: number;
  results: Community[];
}

interface CommunityPostData {
  status: boolean;
  message: string;
}

// 요청 필터 타입
export interface BlogFilters {
  size: number;
  id?: number; // 다음 페이지를 위한 커서 (nextId)
  keyword?: string; // 검색어가 없으면 빈 문자열
  sort?: string;
  categoryCode?: number;
}

// 커뮤니티 콘텐츠 목록 응답 타입
export interface CommunityListResponse {
  timestamp: string;
  status: number;
  code: string | null;
  path: string | null;
  data: CommunityListData;
  details: any[];
}

export interface CommunityDetailResponse {
  timestamp: string;
  status: number;
  code: string | null;
  path: string | null;
  data: CommunityDetail;
  details: any[];
}

export interface CommunityPostResponse {
  timestamp: string;
  status: number;
  code: string | null;
  path: string | null;
  data: CommunityPostData;
  details: any[];
}

// 블로그 생성/수정 요청 타입
export interface BlogRequest {
  title: string;
  description: string;
  categoryId: number[] | number;
  images: File[];
  status: PostStatus;
}

// 댓글 생성/수정 요청 타입 -> 댓글 과 밑 신고는 추후 수정 예정
export interface CommentRequest {
  content: string;
}

// 신고 요청 타입
export interface ReportRequest {
  reason: string; // 신고 사유 (예시로 추가, 실제 API 스펙에 따라 수정 필요)
}

export interface UseRecommendedBlogsProps {
  size?: number;
  categoryCode?: number;
  sort?: string;
}
