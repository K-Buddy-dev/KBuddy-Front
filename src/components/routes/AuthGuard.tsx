import { authClient } from '@/api/axiosConfig';
import { authService } from '@/services';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PUBLIC_PATHS = ['/', '/signup/verify', '/signup/form', '/oauth/signup/form'];

const OAUTH_CALLBACK_PATHS = ['/oauth/callback/kakao', '/oauth2/code/google', '/oauth/callback/apple'];
const ALL_PUBLIC_PATHS = [...PUBLIC_PATHS, ...OAUTH_CALLBACK_PATHS];

export function AuthGuard() {
  const location = useLocation();
  const { pathname } = location;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isOAuthCallback = OAUTH_CALLBACK_PATHS.some((path) => pathname.startsWith(path));

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);

      try {
        const accessToken = authClient.defaults.headers.common['Authorization'];

        if (!accessToken) {
          try {
            const { accessToken: newAccessToken } = await authService.refreshAccessToken();
            if (newAccessToken) {
              authClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
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

  if (isLoading || isAuthenticated === null) {
    return null;
  }

  if (isOAuthCallback) {
    return <Outlet />;
  }

  if (ALL_PUBLIC_PATHS.includes(pathname) && isAuthenticated) {
    return <Navigate to="/community" />;
  }

  if (!ALL_PUBLIC_PATHS.includes(pathname) && !isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
