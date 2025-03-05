import { Button, InfoMessage, TextField, Topbar } from '@/components';
import { useVerifyCode, useVerifyCodeForm } from '@/hooks';
import { useSignupStore } from '@/store';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export function SignupVerifyPage() {
  const { email } = useSignupStore();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useVerifyCodeForm();
  const { verifyCode, error, isLoading } = useVerifyCode();
  const navigate = useNavigate();
  const handleClickBackButton = () => {
    navigate('/');
  };

  const onSubmit = async (data: { code: string }) => {
    try {
      await verifyCode({ email, code: data.code });
      navigate('/signup/form');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <>
      <Topbar title="Create account" type="back" onBack={handleClickBackButton} />
      <form className="mt-[72px] flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
        <InfoMessage
          title="Enter the confirmation code"
          description={`Confirmation sent. To continue, check your email & enter the 6-digit code we sent to ${email}`}
        />
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <TextField id="code" type="text" label="Confirmation code" error={error} {...field} maxLength={6} />
          )}
        />
        <Button variant="solid" color="primary" className="w-full mt-[184px]" disabled={!isValid}>
          {isLoading ? 'Sending...' : 'Next'}
        </Button>
        <span className="text-text-brand-default text-sm font-semibold leading-[14px] tracking-[0.28px] underline cursor-pointer mt-[13px]">
          I didn't get the code
        </span>
      </form>
    </>
  );
}
