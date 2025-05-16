import { PostStatus } from './post';

export interface CreateQnaRequest {
  title: string;
  description: string;
  categoryId: number;
  images: File[];
}

export interface QnaListResponseData {
  id: number;
  writerId: number;
  categoryId: number;
  title: string;
  description: string;
  viewCount: number;
  heartCount: number;
  commentCount: number;
  createdAt: string;
  modifiedAt: string;
  status: PostStatus;
}
