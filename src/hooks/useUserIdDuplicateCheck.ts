import { authService } from '@/services';
import { userIdSchema } from '@/utils/validationSchemas';
import { useState } from 'react';

export const useUserIdDuplicateCheck = () => {
  const [error, setError] = useState<string>('');

  const checkUserIdDuplicate = async (userId: string) => {
    if (!userId) return;

    try {
      userIdSchema.parse(userId);
      await authService.userIdCheck({ userId });
      setError('');
    } catch (error: any) {
      if (error.name === 'ZodError') {
        setError(error.errors[0].message);
      } else {
        const errorMessage = error.response.data.data as string;
        setError(errorMessage);
      }
      throw error;
    }
  };

  return { checkUserIdDuplicate, error };
};
