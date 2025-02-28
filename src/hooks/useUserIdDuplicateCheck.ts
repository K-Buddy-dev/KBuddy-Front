import { authService } from '@/services';
import { useState } from 'react';

export const useUserIdDuplicateCheck = () => {
  const [error, setError] = useState<string>('');

  const checkUserIdDuplicate = async (userId: string) => {
    if (!userId) return;

    try {
      await authService.userIdCheck({ userId });
    } catch (error: any) {
      const errorMessage = error.response.data.data as string;
      setError(errorMessage);
    }
  };

  return { checkUserIdDuplicate, error };
};
