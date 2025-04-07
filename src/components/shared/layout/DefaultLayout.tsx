import { Outlet, useLocation } from 'react-router-dom';

export function DefaultLayout() {
  const location = useLocation();
  const isPaddingDisabled = location.pathname.includes('/community');

  return (
    <div className="w-full h-full min-h-screen flex items-start justify-center bg-slate-200">
      <div
        className={`box-border relative min-w-[280px] xs:w-full sm:w-[600px] h-full min-h-screen bg-bg-default ${isPaddingDisabled ? '' : ' px-4'}`}
      >
        <Outlet />
      </div>
    </div>
  );
}
