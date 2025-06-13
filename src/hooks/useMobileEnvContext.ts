import { createContext, useContext } from 'react';

export interface MobileEnvContextType {
  isMobile: boolean;
  thisOS: 'ios' | 'android' | 'web';
}

export const MobileEnvContext = createContext<MobileEnvContextType | undefined>(undefined);

export const useMobileEnv = () => {
  const context = useContext(MobileEnvContext);
  if (!context) {
    throw new Error('useMobileEnv must be used within a MobileEnvProvider');
  }
  return context;
};
