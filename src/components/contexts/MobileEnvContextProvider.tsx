import { MobileEnvContext } from '@/hooks/useMobileEnvContext';
import { useEffect, useState } from 'react';

export const MobileEnvProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const isMobile = window.ReactNativeWebView ? true : false;
    const isIOS = isMobile ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false;
    const isAndroid = isMobile ? /Android/i.test(navigator.userAgent) : false;
    setIsMobile(isMobile);
    setIsIOS(isIOS);
    setIsAndroid(isAndroid);
  }, []);

  return <MobileEnvContext.Provider value={{ isMobile, isIOS, isAndroid }}>{children}</MobileEnvContext.Provider>;
};
