import { authService, EmailVerifyRequest } from '@/services';
import { useState } from 'react';

export const useEmailVerify = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailVerify = async (data: EmailVerifyRequest) => {
    setIsLoading(true);
    try {
      const result = await authService.emailVerify(data);
      setError('');
      return result;
    } catch (error: any) {
      const errorMessage = error.response.data.data as string;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { emailVerify, error, isLoading };
};
