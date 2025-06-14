import { authClient } from '@/api/axiosConfig';
import { authService } from '@/services';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PUBLIC_PATHS = [
  '/',
  '/signup/verify',
  '/signup/form',
  '/oauth/callback/kakao',
  '/oauth2/code/google',
  '/oauth/callback/apple',
  '/oauth/signup/form',
];

const OAUTH_CALLBACK_PATHS = ['/oauth/callback/kakao', '/oauth2/code/google', '/oauth/callback/apple'];

export function AuthGuard() {
  const location = useLocation();
  const { pathname } = location;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const isOAuthCallback = OAUTH_CALLBACK_PATHS.some((path) => pathname.startsWith(path));

  useEffect(() => {
    const accessToken = authClient.defaults.headers.common['Authorization'];
    setIsAuthenticated(!!accessToken);
  }, [pathname]);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        if (!authClient.defaults.headers.common['Authorization']) {
          const { accessToken } = await authService.refreshAccessToken();
          authClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    refreshToken();
  }, []);

  if (isChecking && !isAuthenticated) {
    return null;
  }

  if (isOAuthCallback) {
    return <Outlet />;
  }

  if (PUBLIC_PATHS.includes(pathname) && isAuthenticated) {
    return <Navigate to={'/home'} />;
  }

  if (!PUBLIC_PATHS.includes(pathname) && !isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return <Outlet />;
}
