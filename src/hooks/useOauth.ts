import { authClient } from '@/api/axiosConfig';
import { notifyFcmAuthReady } from '@/components/FcmTokenBridge';
import { authService } from '@/services';
import { OauthRequest, SignupFormData } from '@/types';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { consumeReturnTo } from '@/utils/returnTo';
import { useToast } from './useToastContext';
import { analyticsService } from '@/services/analyticsService';
import { analyticsEvents } from '@/services/analyticsEvents';

function getAccessToken(result: any) {
  return result?.accessToken ?? result?.data?.accessToken ?? result?.data?.data?.accessToken;
}

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
  const navigate = useNavigate();
  const { showToast } = useToast();

  const oauthLogin = async (data: OauthRequest) => {
    setIsLoading(true);
    try {
      const result = await authService.oauthLogin(data);
      const accessToken = getAccessToken(result);
      if (accessToken) {
        authClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        notifyFcmAuthReady();
      }
      setError({ oAuthCategory: '', oAuthUid: '' });
      return result;
    } catch (error: any) {
      const errorMessage = error.response.data;

      if (errorMessage.status === 422) {
        showToast({
          message: 'This account has been withdrawn.\n If you want to recover, please contact our customer center.',
          type: 'error',
          duration: 5000,
        });
        navigate('/login');

        return;
      }
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
      const birthDate = year && month && day ? `${year.slice(-2)}${month.padStart(2, '0')}${day.padStart(2, '0')}` : '';

      const signupData = {
        firstName,
        lastName,
        email,
        userId,
        birthDate: birthDate,
        country,
        gender,
        oAuthUid,
        oAuthCategory,
      };
      const result = await authService.oauthRegister(signupData);
      let accessToken = getAccessToken(result);
      if (!accessToken && oAuthUid && oAuthCategory) {
        const loginResult = await authService.oauthLogin({ oAuthUid, oAuthCategory });
        accessToken = getAccessToken(loginResult);
      }
      if (accessToken) {
        authClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        notifyFcmAuthReady();
      }
      localStorage.setItem('kBuddyId', userId);
      analyticsService.trackEvent(analyticsEvents.signUpCompleted, {
        method: oAuthCategory || 'oauth',
      });
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
      const { accessToken } = result.data;
      authClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      analyticsService.trackEvent(analyticsEvents.loginCompleted, {
        method: data.oAuthCategory || 'oauth',
      });
      navigate(consumeReturnTo());
    } catch (err: any) {
      console.error('로그인 실패:', err);
    }
  };

  return { handleLogin };
};
