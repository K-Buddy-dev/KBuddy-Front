import { Outlet, useLocation } from 'react-router-dom';
import { BottomNavigation } from '../BottomNavigation';

export function DefaultLayout() {
  const location = useLocation();
  const isPaddingDisabled =
    location.pathname.includes('/community') ||
    location.pathname.includes('/home') ||
    location.pathname.includes('/message') ||
    location.pathname.includes('/notifications') ||
    location.pathname.includes('/discovery') ||
    location.pathname.includes('/service') ||
    location.pathname.includes('/profile') ||
    location.pathname.includes('/settings');
  //배포 환경이 경로 끝에 슬래시를 붙이므로 정확 비교 대신 정규화된 값을 쓴다.
  const pathname = location.pathname.length > 1 ? location.pathname.replace(/\/+$/, '') : location.pathname;
  const isBottomNavigationDisabled =
    pathname === '/login' ||
    location.pathname.includes('/signup') ||
    location.pathname.includes('/oauth') ||
    location.pathname.includes('/community/post') ||
    location.pathname.includes('/community/detail') ||
    location.pathname.startsWith('/service/') ||
    location.pathname.startsWith('/message/') ||
    location.pathname.startsWith('/profile/counselor/create');

  return (
    <div className="w-full h-full min-h-screen flex items-start justify-center bg-slate-200">
      <div
        className={`relative min-w-[280px] w-full sm:w-[600px] h-full min-h-screen bg-bg-default ${isPaddingDisabled ? '' : ' px-4'}`}
      >
        <Outlet />
        {!isBottomNavigationDisabled && (
          <div className="fixed bottom-0 left-0 w-full">
            <BottomNavigation />
          </div>
        )}
      </div>
    </div>
  );
}
