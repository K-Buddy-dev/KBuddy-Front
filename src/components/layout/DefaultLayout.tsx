import { Outlet } from 'react-router-dom';

export function DefaultLayout() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-200">
      <div className="relative w-[360px] h-[768px] px-4 bg-bg-default">
        <Outlet />
      </div>
    </div>
  );
}
