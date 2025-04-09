export interface Qna {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  file: File[];
}

export interface QnaRequest {
  title: string;
  description: string;
  categoryId: number;
  file: File[];
}
