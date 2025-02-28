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
        firstName,
        lastName,
        email,
        userId,
        password,
        birthDate: { year, month, day },
        country,
        gender,
      } = data;

      const signupData = {
        firstName,
        lastName,
        email,
        userId,
        password,
        birthDate: `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`,
        country,
        gender,
      };

      const result = await authService.signup(signupData);
      setError('');
      return result;
    } catch (error: any) {
      const errorMessage = error.response.data.data as string;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, error, isLoading };
};
