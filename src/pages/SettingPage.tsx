import { Topbar } from '@/components/shared';
import { authService } from '@/services';
import { useNavigate } from 'react-router-dom';

export function SettingPage() {
  const navigate = useNavigate();

  const onClickLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Topbar title="Settings" type="back" onBack={() => navigate(-1)} />
      <div className="w-full h-[calc(100vh-79px)] flex flex-col items-center justify-start gap-2 bg-border-weak2 pt-14">
        <div className="w-full bg-white pt-6 px-4 pb-[72px]">
          <p
            className="text-text-default font-semibold leading-4 underline mb-[42px] cursor-pointer"
            onClick={onClickLogout}
          >
            Log out
          </p>
          <span className="text-text-example font-medium leading-3">Version of the app</span>
        </div>
      </div>
    </>
  );
}
