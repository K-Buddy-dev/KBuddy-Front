import { useState } from 'react';
import { PostFormData } from '@/types/post';
import { blogService } from '@/services/blogService';
import { qnaService } from '@/services/qnaService';
import { BlogRequest } from '@/types';

export const usePost = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createPost = async (data: PostFormData, status: 'PUBLISHED' | 'DRAFT') => {
    setIsLoading(true);
    try {
      const { type, ...rest } = data;
      const request: BlogRequest = { ...rest, status };

      if (type === 'blog') {
        await blogService.createBlog(request);
      } else if (type === 'qna') {
        const qnaRequest = {
          ...request,
          categoryId: request.categoryId[0],
        };
        await qnaService.createBlog(qnaRequest);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { createPost, isLoading };
};
