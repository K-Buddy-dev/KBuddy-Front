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

  // 인증 상태 확인 함수
  const checkAuthentication = async () => {
    console.log('🔍 Checking authentication...');

    try {
      // 1. 헤더에 토큰이 있는지 확인
      const accessToken = authClient.defaults.headers.common['Authorization'];

      // 토큰이 없으면 리프레시 시도
      if (!accessToken) {
        console.log('🔄 No token in headers, trying to refresh...');

        try {
          // 리프레시 토큰으로 새 액세스 토큰 요청
          const result = await authService.refreshAccessToken();
          console.log('📊 Refresh result:', result);

          // 새 토큰이 있으면 헤더에 설정
          if (result && (result.accessToken || result.access_token)) {
            const newToken = result.accessToken || result.access_token;
            authClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            console.log('✅ Token refreshed successfully');
            setIsAuthenticated(true);
          } else {
            console.log('❌ No token returned from refresh');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('❌ Token refresh failed:', error);
          setIsAuthenticated(false);
        }
      } else {
        // 토큰이 이미 있으면 인증됨
        console.log('✅ Token exists in headers');
        setIsAuthenticated(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    // OAuth 콜백 경로는 인증 검사 건너뛰기
    if (isOAuthCallback) {
      console.log('⏩ OAuth callback path, skipping auth check');
      setIsLoading(false);
      return;
    }

    checkAuthentication();
  }, []); // 의존성 배열을 비워 컴포넌트 마운트 시에만 실행

  console.log(`🔄 Auth state: loading=${isLoading}, authenticated=${isAuthenticated}, path=${pathname}`);

  // 로딩 중이면 아무것도 렌더링하지 않음
  if (isLoading) {
    return null;
  }

  // OAuth 콜백 경로는 항상 통과
  if (isOAuthCallback) {
    return <Outlet />;
  }

  // 인증되었고 공개 경로에 접근 시 /community로 리다이렉트
  if (ALL_PUBLIC_PATHS.includes(pathname) && isAuthenticated === true) {
    console.log('🔀 Redirecting: authenticated user -> /community');
    return <Navigate to="/community" />;
  }

  // 인증되지 않았고 비공개 경로에 접근 시 /로 리다이렉트
  if (!ALL_PUBLIC_PATHS.includes(pathname) && isAuthenticated === false) {
    console.log('🔀 Redirecting: unauthenticated user -> /');
    return <Navigate to="/" />;
  }

  // 그 외의 경우는 요청된 경로 렌더링
  return <Outlet />;
}
