import { authService } from '@/services';
import { OauthRequest, SignupFormData } from '@/types';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useOauthCheck = () => {
  const [error, setError] = useState({ oAuthCategory: '', oAuthUid: '' });
  const [isLoading, setIsLoading] = useState(false);

  const oauthCheck = async (data: OauthRequest) => {
    setIsLoading(true);
    try {
      const result = await authService.oauthCheck(data);
      setError({ oAuthCategory: '', oAuthUid: '' });
      return result.data.status;
    } catch (error: any) {
      const errorMessage = error.response.data as string;
      console.log('errorMessage: ', errorMessage);
      setError({
        oAuthCategory: errorMessage,
        oAuthUid: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { oauthCheck, error, isLoading };
};

const useOauthLogin = () => {
  const [error, setError] = useState({ oAuthCategory: '', oAuthUid: '' });
  const [isLoading, setIsLoading] = useState(false);

  const oauthLogin = async (data: OauthRequest) => {
    setIsLoading(true);
    try {
      const result = await authService.oauthLogin(data);
      setError({ oAuthCategory: '', oAuthUid: '' });
      return result;
    } catch (error: any) {
      const errorMessage = error.response.data as string;
      console.log('errorMessage: ', errorMessage);
      setError({
        oAuthCategory: errorMessage,
        oAuthUid: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { oauthLogin, error, isLoading };
};

export const useOauthRegister = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const oauthRegister = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const {
        firstName,
        lastName,
        email,
        userId,
        birthDate: { year, month, day },
        country,
        gender,
        oAuthUid,
        oAuthCategory,
      } = data;

      const signupData = {
        firstName,
        lastName,
        email,
        userId,
        birthDate: `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`,
        country,
        gender,
        oAuthUid,
        oAuthCategory,
      };
      const result = await authService.oauthRegister(signupData);
      setError('');
      return result;
    } catch (error: any) {
      const errorMessage = error.response.data.data as string;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { oauthRegister, error, isLoading };
};

export const useMemberCheckHandler = () => {
  const { oauthCheck } = useOauthCheck();

  const [isLoading, setIsLoading] = useState(false);

  const checkMember = useCallback(
    async (data: OauthRequest) => {
      setIsLoading(true);
      try {
        const result = await oauthCheck(data);
        return result;
      } catch (err: any) {
        console.error(err.message || '회원 확인 중 오류 발생');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [oauthCheck]
  );

  return { checkMember, isLoading };
};

export const useOauthLoginHandler = () => {
  const { oauthLogin } = useOauthLogin();
  const navigate = useNavigate();

  const handleLogin = async (data: OauthRequest) => {
    try {
      const result = await oauthLogin(data);
      console.log('로그인 성공, 메인 페이지로 이동:', result);
      navigate('/community');
    } catch (err: any) {
      console.error('로그인 실패:', err);
    }
  };

  return { handleLogin };
};
