import { useState } from 'react';
import { PostFormData } from './usePostForm';
import { blogService } from '@/services/blogService';
import { qnaService } from '@/services/qnaService';

export const usePost = () => {
  const [error, setError] = useState({
    title: '',
    description: '',
    categoryId: '',
    file: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const createPost = async (data: PostFormData) => {
    setIsLoading(true);
    try {
      const { type, ...rest } = data;

      if (type === 'blog') {
        await blogService.createBlog(rest);
      } else if (type === 'qna') {
        const qnaRequest = {
          ...rest,
          categoryId: rest.categoryId[0],
        };
        await qnaService.createBlog(qnaRequest);
      }

      setError({
        title: '',
        description: '',
        categoryId: '',
        file: '',
      });
    } catch (error: any) {
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPost, error, isLoading };
};
