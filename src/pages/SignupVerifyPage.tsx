import { Button, TextField, Topbar } from '@/components';
import { useNavigate } from 'react-router-dom';

export function SignupVerifyPage() {
  const navigate = useNavigate();

  const handleClickBackButton = () => {
    navigate('/');
  };

  const handleClickButton = () => {
    navigate('/signup/form');
  };

  return (
    <>
      <Topbar title="Create account" type="back" onBack={handleClickBackButton} />
      <div className="mt-[72px] flex flex-col items-center">
        <div className="pt-6 pb-4 w-full">
          <h1 className="font-medium text-title-100-medium text-text-default">Enter the confirmation code</h1>
          <p className="font-normal text-body-100-medium text-text-default mt-1">
            Confirmation sent. To continue, check your email & enter the 6-digit code we sent to xxx@gmail.com
          </p>
        </div>
        <TextField id="verify" name="verify" type="text" label="Confirmation code" />
        <Button variant="solid" color="primary" className="w-full mt-[184px]" onClick={handleClickButton}>
          Next
        </Button>
        <span className="text-text-brand-default font-roboto text-sm font-semibold leading-[14px] tracking-[0.28px] underline cursor-pointer mt-[13px]">
          I didn't get the code
        </span>
      </div>
    </>
  );
}
