import { authClient } from '@/api/axiosConfig';
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
        country,
        ...rest
      } = data;

      const signupData: any = {
        ...rest,
      };

      if (year && month && day) {
        signupData.birthDate = `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
      } else {
        signupData.birthDate = '';
      }

      if (!gender) {
        signupData.gender = null;
      }

      if (country && country.trim() !== '') {
        signupData.country = country;
      }

      const result = await authService.signup(signupData);
      const { accessToken } = result.data;
      authClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      localStorage.setItem('kBuddyId', data.userId);
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
