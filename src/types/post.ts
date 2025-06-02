export type PostFormType = 'Blog' | 'Q&A' | '';

export type PostStatus = 'PUBLISHED' | 'DRAFT';

export interface PostFormData {
  title: string;
  description: string;
  type: PostFormType;
  categoryId: number[];
  images: File[];
}

interface PostDraftBase {
  id: number;
  writerUuid: number;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
  modifiedAt: string;
  status: PostStatus;
}

interface BlogDraft extends PostDraftBase {
  type: 'Blog';
  categoryId: number[];
}

interface QnADraft extends PostDraftBase {
  type: 'Q&A';
  categoryId: number;
}

export type PostDraft = BlogDraft | QnADraft;
