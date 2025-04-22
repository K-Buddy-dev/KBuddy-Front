export type PostFormType = 'Blog' | 'Q&A' | '';

export type PostStatus = 'PUBLISHED' | 'DRAFT';

export interface PostFormData {
  title: string;
  description: string;
  type: PostFormType;
  categoryId: number[];
  images: File[];
}

export interface PostDraft {
  id: number;
  writerId: number;
  categoryId: number | number[];
  title: string;
  description: string;
  images: string[];
  createdAt: string;
  modifiedAt: string;
  status: PostStatus;
  type: PostFormType;
}
