import { authService } from '@/services/authService';
import { LoginFormData } from '@/types';
import axios from 'axios';
import { useState } from 'react';

export const useLogin = () => {
  const [error, setError] = useState({ emailOrUserId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await authService.login(data);
      const { accessToken } = result.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setError({ emailOrUserId: '', password: '' });
      return result;
    } catch (error: any) {
      const errorMessage = error.response.data.data as string;
      setError({
        emailOrUserId: errorMessage,
        password: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
};
