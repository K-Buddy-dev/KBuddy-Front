import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isLoggedIn } from '@/utils/auth';
import { saveReturnTo } from '@/utils/returnTo';

interface LoginPromptContextType {
  /**
   * 로그인이 필요한 동작 앞에서 호출한다.
   * 로그인 상태면 true를 돌려주고, 아니면 로그인 안내를 띄우고 false를 돌려준다.
   */
  requireLogin: (message?: string) => boolean;
}

const LoginPromptContext = createContext<LoginPromptContextType | undefined>(undefined);

const DEFAULT_MESSAGE = 'Log in to use this feature.';

export const LoginPromptProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const requireLogin = useCallback((customMessage?: string) => {
    if (isLoggedIn()) {
      return true;
    }
    setMessage(customMessage ?? DEFAULT_MESSAGE);
    return false;
  }, []);

  const close = useCallback(() => setMessage(null), []);

  const goToLogin = useCallback(() => {
    //로그인을 마치면 지금 보던 화면으로 돌려보낸다.
    saveReturnTo(`${location.pathname}${location.search}`);
    setMessage(null);
    navigate('/login');
  }, [location.pathname, location.search, navigate]);

  return (
    <LoginPromptContext.Provider value={{ requireLogin }}>
      {children}
      {message && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black bg-opacity-50 sm:items-center"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div
            className="w-full min-w-[280px] rounded-t-2xl bg-white px-5 pb-8 pt-6 sm:w-[400px] sm:rounded-2xl sm:pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-title-300-bold text-text-strong">Log in required</h2>
            <p className="mt-2 text-body-200-light text-text-default">{message}</p>
            <button
              type="button"
              className="mt-6 h-12 w-full rounded-lg bg-bg-brand-default text-body-200-bold font-semibold text-white"
              onClick={goToLogin}
            >
              Log in or sign up
            </button>
            <button
              type="button"
              className="mt-2 h-12 w-full rounded-lg text-body-200-light text-text-default"
              onClick={close}
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </LoginPromptContext.Provider>
  );
};

export const useLoginPrompt = () => {
  const context = useContext(LoginPromptContext);
  if (!context) {
    throw new Error('useLoginPrompt must be used within a LoginPromptProvider');
  }
  return context;
};
