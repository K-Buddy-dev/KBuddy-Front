import { authClient } from '@/api/axiosConfig';
import { authService } from '@/services';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const LOGIN_PATH = '/login';

/**
 * 로그인이 필요한 경로.
 *
 * 기본은 공개이며, 여기에 해당하는 경로만 비로그인 사용자를 로그인 화면으로 보낸다.
 * 게시글 조회·서비스 둘러보기 등은 로그인 없이 접근할 수 있어야 전환율 목표를 만족한다.
 */
const PROTECTED_PATH_PATTERNS: RegExp[] = [
  /^\/profile(\/|$)/,
  /^\/settings(\/|$)/,
  /^\/message(\/|$)/,
  /^\/notifications(\/|$)/,
  /^\/block-user(\/|$)/,
  /^\/community\/post(\/|$)/,
  /^\/community\/edit(\/|$)/,
  /^\/service\/[^/]+\/request(\/|$)/,
];

/** 이미 로그인한 사용자가 다시 볼 이유가 없는 경로 */
const AUTH_ONLY_PATHS = [LOGIN_PATH, '/signup/verify', '/signup/form', '/oauth/signup/form'];

/** 소셜 로그인 콜백은 인증 상태와 무관하게 페이지 로직이 실행되어야 한다. */
const OAUTH_CALLBACK_PATHS = ['/oauth/callback/kakao', '/oauth2/code/google', '/oauth/apple-redirect'];

/**
 * 배포 환경(S3/CloudFront)이 경로 끝에 슬래시를 붙여 리다이렉트하므로,
 * pathname 이 '/login/' 처럼 들어올 수 있다. 비교 전에 정규화한다.
 */
const normalizePath = (pathname: string) => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname);

const isProtectedPath = (pathname: string) => PROTECTED_PATH_PATTERNS.some((pattern) => pattern.test(pathname));

export function AuthGuard() {
  const location = useLocation();
  const pathname = normalizePath(location.pathname);
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
          const { data } = await authService.refreshAccessToken();
          const accessToken = data?.accessToken as string | undefined;
          if (accessToken) {
            authClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch {
        //비로그인 사용자는 재발급이 실패하는 것이 정상 경로다. 게스트로 계속 진행한다.
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

  if (isAuthenticated && AUTH_ONLY_PATHS.includes(pathname)) {
    return <Navigate to={'/home'} replace />;
  }

  //로그인 후 원래 보려던 화면으로 돌아갈 수 있도록 위치를 넘긴다.
  if (!isAuthenticated && isProtectedPath(pathname)) {
    return <Navigate to={LOGIN_PATH} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
