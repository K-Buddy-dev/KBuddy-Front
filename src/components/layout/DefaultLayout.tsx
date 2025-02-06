import { Outlet } from 'react-router-dom';

export function DefaultLayout() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full sm:w-[600px]">
        <Outlet />
      </div>
    </div>
  );
}
