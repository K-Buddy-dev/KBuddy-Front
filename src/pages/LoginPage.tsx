import { Topbar } from '../components/topbar/Topbar.tsx';

export function LoginPage() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[360px] h-[768px] pt-14 px-4">
        <Topbar title="Log in or sign up" />
      </div>
    </div>
  );
}
