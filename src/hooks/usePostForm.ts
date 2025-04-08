// src/hooks/usePostForm.ts
import { useForm } from 'react-hook-form';
import { useCommunityFormStateContext } from '@/hooks/useCommunityFormContext';

interface CommunityFormData {
  title: string;
  description: string;
  type: 'blog' | 'qna';
  categoryId: number;
  file: File[];
}

export const usePostForm = () => {
  const { title, description, file } = useCommunityFormStateContext();

  return useForm<CommunityFormData>({
    defaultValues: {
      title,
      description,
      type: 'blog',
      categoryId: 0,
      file,
    },
    mode: 'onChange',
  });
};
