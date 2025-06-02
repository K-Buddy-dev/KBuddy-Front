import { authService } from '@/services';
import { VerifyCodeRequest } from '@/types';
import { useState } from 'react';

export const useVerifyCode = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const verifyCode = async (data: VerifyCodeRequest) => {
    setIsLoading(true);
    try {
      const result = await authService.verifyCode(data);
      setError('');
      return result;
    } catch (error: any) {
      setError('Verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyCode, error, isLoading };
};
