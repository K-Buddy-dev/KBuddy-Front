import { MobileEnvContext } from '@/hooks/useMobileEnvContext';
import { useEffect, useState } from 'react';

export const MobileEnvProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [thisOS, setThisOS] = useState<'ios' | 'android' | 'web'>('web');

  useEffect(() => {
    const isMobile = window.ReactNativeWebView ? true : false;
    const thisOS = isMobile ? (/iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'ios' : 'android') : 'web';
    setIsMobile(isMobile);
    setThisOS(thisOS);
  }, []);

  return <MobileEnvContext.Provider value={{ isMobile, thisOS }}>{children}</MobileEnvContext.Provider>;
};
