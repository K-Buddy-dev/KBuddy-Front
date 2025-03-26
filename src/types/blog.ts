// src/types/blog.ts

// 카테고리 열거형으로 제작 -> 추가 예정
export enum BlogCategory {
  RESTAURANT_CAFE = 'RESTAURANT_CAFE',
}

export enum BlogSort {
  VIEW_COUNT = 'VIEW_COUNT',
  HEART_COUNT = 'HEART_COUNT',
  COMMENT_COUNT = 'COMMENT_COUNT',
  LATEST = 'LATEST',
  OLDEST = 'OLDEST',
}

// 댓글 타입
export interface Comment {
  id: number;
  content: string;
  writer: string;
  heartCount: number;
  isReply: boolean;
  parentId: number | null;
  createdDate: string;
  deleted: boolean;
}

// 블로그 타입
export interface Blog {
  id: number;
  title: string;
  content: string;
  writer: string;
  category: BlogCategory;
  imageUrls: string[];
  heartCount: number;
  commentCount: number;
  viewCount: number;
  comments: Comment[];
  createdDate: string;
}

// 블로그 목록 응답 타입
export interface BlogListResponse {
  timestamp: string;
  status: number;
  code: string | null;
  path: string | null;
  data: {
    blogs: Blog[];
    hasNext: boolean;
    nextCursor: number;
  };
  details: any[];
}

// 블로그 생성/수정 요청 타입
export interface BlogRequest {
  title: string;
  content: string;
  category: BlogCategory;
  imageUrls: string[];
}

// 댓글 생성/수정 요청 타입 -> 댓글 과 밑 신고는 추후 수정 예정
export interface CommentRequest {
  content: string;
}

// 신고 요청 타입
export interface ReportRequest {
  reason: string; // 신고 사유 (예시로 추가, 실제 API 스펙에 따라 수정 필요)
}
