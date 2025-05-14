import { Outlet, useLocation } from 'react-router-dom';
import { BottomNavigation } from '../BottomNavigation';

export function DefaultLayout() {
  const location = useLocation();
  const isPaddingDisabled =
    location.pathname.includes('/community') ||
    location.pathname.includes('/profile') ||
    location.pathname.includes('/settings');
  const isLoginPage =
    location.pathname === '/' || location.pathname.includes('/signup') || location.pathname.includes('/oauth');
  const isBottomNavigationDisabled = location.pathname.includes('/community/post');

  return (
    <div className="w-full h-full min-h-screen flex items-start justify-center bg-slate-200">
      <div
        className={`relative min-w-[280px] w-full sm:w-[600px] h-full min-h-screen bg-bg-default ${isPaddingDisabled ? '' : ' px-4'}`}
      >
        <div className={`${isLoginPage ? '' : 'pb-16'}`}>
          <Outlet />
        </div>
        {!isLoginPage && !isBottomNavigationDisabled && (
          <div className="absolute bottom-0 left-0 w-full">
            <BottomNavigation />
          </div>
        )}
      </div>
    </div>
  );
}
