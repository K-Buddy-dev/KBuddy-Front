import { Outlet, useLocation } from 'react-router-dom';
import { BottomNavigation } from '../BottomNavigation';

export function DefaultLayout() {
  const location = useLocation();
  const isPaddingDisabled =
    location.pathname.includes('/community') ||
    location.pathname.includes('/home') ||
    location.pathname.includes('/profile') ||
    location.pathname.includes('/settings');
  const isBottomNavigationDisabled =
    location.pathname === '/' ||
    location.pathname.includes('/signup') ||
    location.pathname.includes('/oauth') ||
    location.pathname.includes('/community/post') ||
    location.pathname.includes('/community/detail');

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
