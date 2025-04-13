export interface Blog {
  id: number;
  title: string;
  description: string;
  categoryId: number[];
  images?: File[];
}

// 카테고리 열거형으로 제작 -> 추가 예정
export enum BlogCategory {
  RESTAURANT_CAFE = 'RESTAURANT_CAFE',
  SHOPPING = 'SHOPPING',
}

export enum CommunitySort {
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

// 커뮤니티 콘텐츠 타입
export interface Community {
  id: number;
  writerId: number;
  categoryId: number;
  title: string;
  description: string;
  imageUrls?: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;

  createdAt: string;
  createdDate: string;
}
// 전체
// "id": 0,
// "writerId": 0,
// "categoryId": 0,
// "title": "string",
// "description": "string",
// "viewCount": 0,
// "likeCount": 0,
// "commentCount": 0,

// }
// 한개
// "id": 0,
// "writerId": 0,
// "categoryId": 0,
// "title": "string",
// "description": "string",
// "viewCount": 0,

// "images": [
//   {
//     "type": "PNG",
//     "name": "string",
//     "url": "string"
//   }
// ],
// "comments": [
//   {
//     "id": 0,
//     "qnaId": 0,
//     "writerId": 0,
//     "description": "string",
//     "createdAt": "2025-03-31T13:50:12.250Z",
//     "modifiedAt": "2025-03-31T13:50:12.250Z"
//   }
// ],
// "heartCount": 0,
// "commentCount": 0
// },

// 커뮤니티 콘텐츠 목록 응답 타입
export interface CommunityListResponse {
  timestamp: string;
  status: number;
  code: string | null;
  path: string | null;
  data: {
    nextId: number;
    results: Community[];
  };
  details: any[];
}

// 커뮤니티 콘텐츠 목록 응답 타입
export interface CommunityResponse {
  timestamp: string;
  status: number;
  code: string | null;
  path: string | null;
  data: {
    nextId: number;
    results: Community[];
  };
  details: any[];
}

// 블로그 생성/수정 요청 타입
export interface BlogRequest {
  title: string;
  description: string;
  categoryId: number[];
  images: File[];
  status: 'PUBLISHED' | 'DRAFT';
}

// 댓글 생성/수정 요청 타입 -> 댓글 과 밑 신고는 추후 수정 예정
export interface CommentRequest {
  content: string;
}

// 신고 요청 타입
export interface ReportRequest {
  reason: string; // 신고 사유 (예시로 추가, 실제 API 스펙에 따라 수정 필요)
}
