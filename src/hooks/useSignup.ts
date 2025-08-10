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
        gender,
        ...rest
      } = data;

      const signupData: any = {
        ...rest,
      };

      // birthDate가 모든 값이 있을 때만 포함
      if (year && month && day) {
        signupData.birthDate = `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
      }

      // gender가 빈 문자열이 아닐 때만 포함
      if (gender && gender.trim() !== '') {
        signupData.gender = gender;
      }

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
