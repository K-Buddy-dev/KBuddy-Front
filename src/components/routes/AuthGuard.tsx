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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = authClient.defaults.headers.common['Authorization'];
    setIsAuthenticated(!!accessToken);
  }, [pathname]);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        if (!authClient.defaults.headers.common['Authorization']) {
          console.log(authClient.defaults.headers.common['Authorization']);
          const { accessToken } = await authService.refreshAccessToken();
          authClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    refreshToken();
  }, []);

  if (PUBLIC_PATHS.includes(pathname) && isAuthenticated) {
    return <Navigate to={'/community'} />;
  }

  if (!PUBLIC_PATHS.includes(pathname) && !isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return <Outlet />;
}
