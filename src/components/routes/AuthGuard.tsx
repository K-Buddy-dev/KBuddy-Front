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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isOAuthCallback = OAUTH_CALLBACK_PATHS.some((path) => pathname.startsWith(path));
  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);

      try {
        const accessToken = authClient.defaults.headers.common['Authorization'];

        if (!accessToken) {
          try {
            const { accessToken } = await authService.refreshAccessToken();
            if (accessToken) {
              authClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error('Failed to refresh token:', error);
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!isOAuthCallback) {
      checkAuthentication();
    } else {
      setIsLoading(false);
    }
  }, [pathname, isOAuthCallback]);

  if (isLoading) {
    return null;
  }

  if (isOAuthCallback) {
    return <Outlet />;
  }

  if (PUBLIC_PATHS.includes(pathname) && isAuthenticated) {
    return <Navigate to="/community" />;
  }

  if (!PUBLIC_PATHS.includes(pathname) && !isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
