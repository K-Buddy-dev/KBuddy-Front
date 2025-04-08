export const CategoryMap: Record<number, string> = {
  0: 'Restaurant',
  1: 'Shopping',
  2: 'Lodging',
  3: 'Art',
  4: 'Transportation',
  5: 'Daily Life',
  6: 'Cafe/Dessert',
  7: 'Attraction',
  8: 'Nature',
  9: 'Health',
  10: 'Others',
};

export const CategoryNameToId: Record<string, number> = Object.fromEntries(
  Object.entries(CategoryMap).map(([id, name]) => [name, parseInt(id)])
);

export const CategoryNames = Object.values(CategoryMap);

// 응답 데이터 타입
interface Community {
  id: number;
  writerId: number;
  categoryId: number[];
  title: string;
  description: string;
  viewCount: number;
  heartCount: number;
  commentCount: number;
  createdAt: string;
  modifiedAt: string;
}

interface BlogListData {
  nextId: number;
  results: Community[];
}

export interface BlogListResponse {
  timestamp: string;
  status: number;
  code: string | null;
  path: string | null;
  data: BlogListData;
  details: any[];
}

// 요청 필터 타입
export interface BlogFilters {
  size: number;
  id?: number; // 다음 페이지를 위한 커서 (nextId)
  keyword: string; // 검색어가 없으면 빈 문자열
  sort?: CommunitySort;
}

// CommunitySort 타입
export enum CommunitySort {
  LATEST = 'latest',
  POPULAR = 'popular',
}

// sort 값 검증 함수
export const isCommunitySort = (value: string | null): value is CommunitySort => {
  return value === 'latest' || value === 'popular'; // 임시구현
};

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
// export interface BlogRequest {
//   title: string;
//   content: string;
//   category: BlogCategory;
//   imageUrls: string[];
// }

// 댓글 생성/수정 요청 타입 -> 댓글 과 밑 신고는 추후 수정 예정
export interface CommentRequest {
  content: string;
}

// 신고 요청 타입
export interface ReportRequest {
  reason: string; // 신고 사유 (예시로 추가, 실제 API 스펙에 따라 수정 필요)
}
