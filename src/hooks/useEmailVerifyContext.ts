import { EmailVerifyRequest } from '@/services';
import { createContext, useContext } from 'react';

export interface EmailVerifyStateContextType {
  email: string;
  error: string;
  isLoading: boolean;
  isVerify: boolean;
}

export interface EmailVerifyActionContextType {
  setEmail: (email: string) => void;
  emailVerify: (data: EmailVerifyRequest) => Promise<any>;
}

export const EmailVerifyStateContext = createContext<EmailVerifyStateContextType | undefined>(undefined);
export const EmailVerifyActionContext = createContext<EmailVerifyActionContextType | undefined>(undefined);

export const useEmailVerifyStateContext = () => {
  const state = useContext(EmailVerifyStateContext);
  if (state === undefined) {
    throw new Error('useEmailVerifyStateContext must be used within an EmailVerifyStateContext');
  }
  return state;
};

export const useEmailVerifyActionContext = () => {
  const action = useContext(EmailVerifyActionContext);
  if (action === undefined) {
    throw new Error('useEmailVerifyActionContext must be used within an EmailVerifyActionContext');
  }
  return action;
};
