import { Outlet, useLocation } from 'react-router-dom';

export function DefaultLayout() {
  const location = useLocation();
  const isPaddingDisabled = location.pathname === '/community';

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-200">
      <div
        className={`relative min-w-[280px] xs:w-full sm:w-[600px] h-full bg-bg-default ${isPaddingDisabled ? '' : ' px-4'}`}
      >
        <Outlet />
      </div>
    </div>
  );
}
