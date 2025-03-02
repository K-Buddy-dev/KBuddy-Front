import { authService, VerifyCodeRequest } from '@/services';
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
      const errorMessage = error.response.data.data as string;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyCode, error, isLoading };
};
