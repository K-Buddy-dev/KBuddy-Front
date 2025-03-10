import { authService } from '@/services';
import { SignupFormData } from '@/types';
import { useState } from 'react';

export const useSignup = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signup = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const {
        birthDate: { year, month, day },
        confirmPassword: _,
        ...rest
      } = data;

      const signupData = {
        ...rest,
        birthDate: `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`,
      };

      const result = await authService.signup(signupData);
      setError('');
      return result;
    } catch (error: any) {
      const errorMessage = error.response.data.data as string;
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, error, isLoading };
};
