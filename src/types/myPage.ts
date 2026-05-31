export interface Bookmark {
  id: number;
  writerUuid: string;
  writerName: string;
  writerProfileImageUrl: string;
  postType: string;
  categoryId: number[];
  title: string;
  description: string;
  viewCount: number;
  heartCount: number;
  commentCount: number;
  createdAt: string;
  modifiedAt: string;
  thumbnailImageUrl: string;
  isHearted: boolean;
  isBookmarked: boolean;
}

export interface BookmarkListResponse {
  timestamp: string;
  status: number;
  code: string | null;
  path: string | null;
  data: Bookmark[];
  details: any[];
}
