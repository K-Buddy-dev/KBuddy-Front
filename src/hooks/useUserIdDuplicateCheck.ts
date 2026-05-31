import { authService } from '@/services';
import { userIdSchema } from '@/utils/validationSchemas';
import { useState } from 'react';

const DUPLICATE_USER_ID_MESSAGE = 'This user ID is already taken.';

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
        setError(DUPLICATE_USER_ID_MESSAGE);
      }
      throw error;
    }
  };

  return { checkUserIdDuplicate, error };
};
