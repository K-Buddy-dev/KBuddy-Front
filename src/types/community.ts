import { PostStatus } from './post';

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
  writerUuid: number;
  writerName: string;
  writerProfileImageUrl: string;
  categoryId: number[] | number;
  title: string;
  description: string;
  viewCount: number;
  heartCount: number;
  isHearted: boolean;
  isBookmarked: boolean;
  commentCount: number;
  createdAt: string;
  thumbnailImageUrl: string;
}

export interface Comment {
  id: number;
  blogId: number;
  writerUuid: number;
  writerName: string;
  writerProfileImageUrl: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
  replies: Comment[];
  heartCount: number;
  isHearted: boolean;
}

export interface CommunityDetail {
  id: number;
  writerUuid: number;
  writerName: string;
  writerProfileImageUrl: string;
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

// 댓글 생성/수정
export interface CommentRequest {
  content: string;
  parentId: null | number;
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
