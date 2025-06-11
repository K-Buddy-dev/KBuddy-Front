import {
  EmailVerifyActionContext,
  EmailVerifyActionContextType,
  EmailVerifyStateContext,
  EmailVerifyStateContextType,
} from '@/hooks';
import { authService, EmailVerifyRequest } from '@/services';
import { useCallback, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const EmailVerifyContextProvider = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailVerify = useCallback(async (data: EmailVerifyRequest) => {
    setIsLoading(true);
    try {
      const result = await authService.emailVerify(data);
      setError('');
      setIsVerify(true);
      return result;
    } catch (error: any) {
      const errorMessage = 'This email is already registered';
      setError(errorMessage);
      setIsVerify(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const emailVerifyStateContextValue = useMemo<EmailVerifyStateContextType>(
    () => ({ email, error, isLoading, isVerify }),
    [email, error, isLoading, isVerify]
  );
  const emailVerifyActionContextValue = useMemo<EmailVerifyActionContextType>(
    () => ({
      setEmail,
      emailVerify,
    }),
    [setEmail]
  );

  return (
    <EmailVerifyActionContext.Provider value={emailVerifyActionContextValue}>
      <EmailVerifyStateContext.Provider value={emailVerifyStateContextValue}>
        <Outlet />
      </EmailVerifyStateContext.Provider>
    </EmailVerifyActionContext.Provider>
  );
};
