import { Outlet } from 'react-router-dom';

export function DefaultLayout() {
  return (
    <div className="min-w-[280px] w-full h-screen flex items-center justify-center bg-slate-200">
      <div className="relative xs:w-full sm:w-[360px] h-full px-4 bg-bg-default">
        <Outlet />
      </div>
    </div>
  );
}
