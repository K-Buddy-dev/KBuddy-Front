export type PostFormType = 'blog' | 'qna' | '';

export interface PostFormData {
  title: string;
  description: string;
  type: PostFormType;
  categoryId: number[];
  images: File[];
}
