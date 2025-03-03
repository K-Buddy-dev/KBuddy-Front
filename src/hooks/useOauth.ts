import { authService } from '@/services';
import { OauthRegisterRequest, OauthRequest } from '@/types';
import { useEffect, useState } from 'react';
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
      const result = await authService.oauthCheck(data);
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
  const [error, setError] = useState({ oAuthCategory: '', oAuthUid: '' });
  const [isLoading, setIsLoading] = useState(false);

  const oauthRegister = async (data: OauthRegisterRequest) => {
    setIsLoading(true);
    try {
      const result = await authService.oauthCheck(data);
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

  return { oauthRegister, error, isLoading };
};

export const useMemberCheckHandler = (data: OauthRequest) => {
  const { oauthCheck } = useOauthCheck();

  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkMember = async () => {
      setIsLoading(true);
      try {
        const result = await oauthCheck(data);
        setIsMember(result);
      } catch (err: any) {
        setError(err.message || '회원 확인 중 오류 발생');
      } finally {
        setIsLoading(false);
      }
    };

    checkMember();
  }, [data]);

  return { isMember, error, isLoading };
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
