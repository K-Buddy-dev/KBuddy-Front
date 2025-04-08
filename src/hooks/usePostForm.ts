// src/hooks/usePostForm.ts
import { useForm } from 'react-hook-form';
import { useCommunityFormStateContext } from '@/hooks/useCommunityFormContext';

export interface PostFormData {
  title: string;
  description: string;
  type: 'blog' | 'qna' | '';
  categoryId: number[];
  file: File[];
}

export const usePostForm = () => {
  const { title, description, file } = useCommunityFormStateContext();

  return useForm<PostFormData>({
    defaultValues: {
      title,
      description,
      type: '',
      categoryId: [],
      file: file || [],
    },
    mode: 'onChange',
  });
};
