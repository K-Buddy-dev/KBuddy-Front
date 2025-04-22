import { useState } from 'react';
import { PostFormData } from '@/types/post';
import { blogService } from '@/services/blogService';
import { qnaService } from '@/services/qnaService';
import { BlogRequest } from '@/types';

export const usePost = () => {
  const [isLoading, setIsLoading] = useState(false);

  // 임시저장 게시글 삭제 함수 - 게시글 타입에 따라 적절한 API 호출
  const deletePost = async (postId: number, type: 'Blog' | 'Q&A') => {
    try {
      console.log(`${type} 타입의 임시저장 게시글 #${postId} 삭제 중...`);
      if (type === 'Blog') {
        // Blog 타입 삭제
        await blogService.deleteBlog(postId);
      } else if (type === 'Q&A') {
        // Q&A 타입 삭제
        await qnaService.deleteQna(postId);
      }
    } catch (error) {
      console.error(`${type} 타입의 임시저장 게시글 #${postId} 삭제 실패:`, error);
      throw error;
    }
  };

  const createPost = async (data: PostFormData, status: 'PUBLISHED' | 'DRAFT') => {
    setIsLoading(true);
    try {
      const { type, ...rest } = data;
      const request: BlogRequest = { ...rest, status };
      if (type === 'Blog') {
        await blogService.createBlog(request);
      } else if (type === 'Q&A') {
        const qnaRequest = {
          ...request,
          categoryId: request.categoryId[0],
        };
        await qnaService.createQna(qnaRequest);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async (postId: number, data: PostFormData, originalType?: 'Blog' | 'Q&A') => {
    setIsLoading(true);
    try {
      // 수정 시에는 항상 PUBLISHED 상태로 설정
      const request: BlogRequest = { ...data, status: 'PUBLISHED' };

      // 타입이 변경된 경우 (originalType이 있고 현재 타입과 다른 경우)
      if (originalType && originalType !== data.type) {
        // 1. 기존 임시저장 게시글 삭제
        await deletePost(postId, originalType);

        // 2. 새 타입으로 게시글 생성
        if (data.type === 'Blog') {
          await blogService.createBlog(request);
        } else if (data.type === 'Q&A') {
          const qnaRequest = {
            ...request,
            categoryId: request.categoryId[0],
          };
          await qnaService.createQna(qnaRequest);
        }
      }
      // 타입이 변경되지 않은 경우 일반적인 업데이트 수행
      else {
        if (data.type === 'Blog') {
          await blogService.updateBlog(postId, request);
        } else if (data.type === 'Q&A') {
          const qnaRequest = {
            ...request,
            categoryId: request.categoryId[0],
          };
          await qnaService.updateQna(postId, qnaRequest);
        }
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { createPost, updatePost, isLoading };
};
