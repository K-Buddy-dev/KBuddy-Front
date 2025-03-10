import {
  EmailVerifyActionContext,
  EmailVerifyActionContextType,
  EmailVerifyStateContext,
  EmailVerifyStateContextType,
} from '@/hooks';
import { authService, EmailVerifyRequest } from '@/services';
import { useCallback, useMemo, useState } from 'react';

export const EmailVerifyContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailVerify = useCallback(async (data: EmailVerifyRequest) => {
    setIsLoading(true);
    try {
      const result = await authService.emailVerify(data);
      setError('');
      return result;
    } catch (error: any) {
      const errorMessage = 'Email verification failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const emailVerifyStateContextValue = useMemo<EmailVerifyStateContextType>(
    () => ({ email, error, isLoading }),
    [email]
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
        {children}
      </EmailVerifyStateContext.Provider>
    </EmailVerifyActionContext.Provider>
  );
};
