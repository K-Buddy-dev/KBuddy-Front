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

export function AuthGuard() {
  const location = useLocation();
  const { pathname } = location;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = authClient.defaults.headers.common['Authorization'];
    setIsAuthenticated(!!accessToken);
  }, [pathname]);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        setIsLoading(true);
        const accessToken = authClient.defaults.headers.common['Authorization'];
        if (!accessToken) {
          const { accessToken: newAccessToken } = await authService.refreshAccessToken();
          authClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        delete authClient.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    refreshToken();
  }, []);

  if (isLoading || isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (PUBLIC_PATHS.includes(pathname) && isAuthenticated) {
    return <Navigate to={'/community'} />;
  }

  if (!PUBLIC_PATHS.includes(pathname) && !isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return <Outlet />;
}
