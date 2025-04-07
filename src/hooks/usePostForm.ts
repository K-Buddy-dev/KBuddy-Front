// src/hooks/usePostForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postFormSchema, PostFormData } from '@/utils/validationSchemas';
import { useCommunityFormStateContext } from '@/hooks/useCommunityFormContext';

export const usePostForm = () => {
  const { title, description } = useCommunityFormStateContext();

  return useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: title || '',
      description: description || '',
    },
    mode: 'onChange',
  });
};
